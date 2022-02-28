from flask import abort, Blueprint, jsonify, make_response, request

from app import db
from app.auth import *
from app.env import *
from app.helper import *

import numpy as np
import pandas as pd
import pandas_ta as ta

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

from datetime import datetime, timedelta




# Define watchlist blueprint
prediction_bp = Blueprint('/prediction', __name__)

@prediction_bp.route("/get_prediction", methods=['GET'])
def get_prediction():
    if request.method == 'GET':
        try:
            symbol = request.args.get('symbol')
            actual, past_pred, future_pred, x_dates = prediction(symbol)

            dates = []
            for d in x_dates:
                dates.append(convert_time_str_to_epoch(d))

            data = []
            for date in dates:
                data.append({
                    'date': date,
                    'actual': actual[dates.index(date)],
                    'past_pred': past_pred[dates.index(date)],
                    'future_pred': future_pred[dates.index(date)]
                })

            return jsonify(data)


        except Exception as error:
            print(error)
            abort(400)


def prediction(symbol):
    date_data, features, num_data_points, display_date_range = get_data(symbol)
   
    # normalize
    pre_normalization_features = np.copy(features)
    scalers = [Normalizer() for i in range(num_features+1)] # features + output
    for feature in range(features.shape[1]):
        features[:, feature] = scalers[feature].fit_transform(features[:, feature])

    # post normalization
    x_feat = np.delete(features, 0, axis=1)
    y_feat = features[:, 0]
    data_x, data_x_unseen = prepare_data_x(x_feat, window_size=window_size)
    data_y = prepare_data_y(y_feat, window_size=window_size)

    # split data into training and testing
    split_index = int(data_y.shape[0]*train_size)
    data_x_train = data_x[:split_index]
    data_x_val = data_x[split_index:]
    data_y_train = data_y[:split_index]
    data_y_val = data_y[split_index:]

    # prepare data for plotting
    to_plot_data_y_train = np.zeros(num_data_points)
    to_plot_data_y_val = np.zeros(num_data_points)

    to_plot_data_y_train[window_size:split_index+window_size] = scalers[0].inverse_transform(data_y_train)
    to_plot_data_y_val[split_index+window_size:] = scalers[0].inverse_transform(data_y_val)

    to_plot_data_y_train = np.where(to_plot_data_y_train == 0, None, to_plot_data_y_train)
    to_plot_data_y_val = np.where(to_plot_data_y_val == 0, None, to_plot_data_y_val)

    # Create datasets
    dataset_train = TimeSeriesDataset(data_x_train, data_y_train)
    dataset_val = TimeSeriesDataset(data_x_val, data_y_val)

    # Create dataloaders
    train_dataloader = DataLoader(dataset_train, batch_size=batch_size, shuffle=True)
    val_dataloader = DataLoader(dataset_val, batch_size=batch_size, shuffle=True)

    # Create model
    model = LSTMModel(input_size=num_features, hidden_layer_size=lstm_size, num_layers=num_lstm_layers, output_size=1, dropout=dropout)
    model = model.to(device)

    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate, betas=(0.9, 0.98), eps=1e-9)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=scheduler_step_size, gamma=0.1)

    for epoch in range(num_epochs):
        loss_train, lr_train = run_epoch(model, optimizer, scheduler, criterion, train_dataloader, is_training=True)
        loss_val, lr_val = run_epoch(model, optimizer, scheduler, criterion, val_dataloader)
        scheduler.step()

        print('Epoch[{}/{}] | loss train:{:.6f}, test:{:.6f} | lr:{:.6f}'
            .format(epoch + 1, num_epochs, loss_train, loss_val, lr_train))


    # here we re-initialize dataloader so the data doesn't shuffled, so we can plot the values by date
    train_dataloader = DataLoader(dataset_train, batch_size=batch_size, shuffle=False)
    val_dataloader = DataLoader(dataset_val, batch_size=batch_size, shuffle=False)
    
    model.eval()


    # predict on the training data, to see how well the model managed to learn and memorize
    predicted_train = np.array([])
    for idx, (x, y) in enumerate(train_dataloader):
        x = x.to(device)
        out = model(x)
        out = out.cpu().detach().numpy()
        predicted_train = np.concatenate((predicted_train, out))

    # predict on the validation data, to see how the model does on unseen data
    predicted_val = np.array([])
    for idx, (x, y) in enumerate(val_dataloader):
        x = x.to(device)
        out = model(x)
        out = out.cpu().detach().numpy()
        predicted_val = np.concatenate((predicted_val, out))


    # prepare the data for plotting
    to_plot_data_y_train_pred = np.zeros(num_data_points) # this is the predicted data for the training data
    to_plot_data_y_val_pred = np.zeros(num_data_points) # this is the predicted data for the validation data (unseen)

    to_plot_data_y_train_pred[window_size:split_index+window_size] = scalers[0].inverse_transform(predicted_train)
    to_plot_data_y_val_pred[split_index+window_size:] = scalers[0].inverse_transform(predicted_val)

    to_plot_data_y_train_pred = np.where(to_plot_data_y_train_pred == 0, None, to_plot_data_y_train_pred)
    to_plot_data_y_val_pred = np.where(to_plot_data_y_val_pred == 0, None, to_plot_data_y_val_pred)


    # prepare data for plotting the zoomed in view of the predicted prices vs. actual prices
    to_plot_data_y_val_subset = scalers[0].inverse_transform(data_y_val)
    to_plot_predicted_val = scalers[0].inverse_transform(predicted_val)
    to_plot_date_data = date_data[split_index+window_size:]

    # predict the closing price of the next trading day - only the first one is relevant right now lol
    next_n_predictions = []
    n_preds = 1 # number of predictions to make
    for n in range(n_preds):
        model.eval()
        
        x = torch.tensor(data_x_unseen).float().to(device).unsqueeze(0) # don't need, we have more than 1 feature .unsqueeze(2) # this is the data type and shape required, [batch, sequence, feature]
        
        prediction = model(x)
        prediction = prediction.cpu().detach().numpy()
        
        next_n_predictions.append(scalers[0].inverse_transform(prediction))

    # prepare for plotting
    plot_range = 10 + len(next_n_predictions)
    to_plot_data_y_val = np.zeros(plot_range) # actual prices
    to_plot_data_y_val_pred = np.zeros(plot_range) # past predicted prices
    to_plot_data_y_test_pred = np.zeros(plot_range) # future predicted prices

    to_plot_data_y_val[:plot_range-n_preds] = scalers[0].inverse_transform(data_y_val)[-plot_range+n_preds:]
    to_plot_data_y_val_pred[:plot_range-n_preds] = scalers[0].inverse_transform(predicted_val)[-plot_range+n_preds:]
    predictions = np.array(next_n_predictions).reshape(1, n_preds)
    to_plot_data_y_test_pred[plot_range-len(next_n_predictions):] = predictions
    
    to_plot_data_y_val = np.where(to_plot_data_y_val == 0, None, to_plot_data_y_val)
    to_plot_data_y_val_pred = np.where(to_plot_data_y_val_pred == 0, None, to_plot_data_y_val_pred)
    to_plot_data_y_test_pred = np.where(to_plot_data_y_test_pred == 0, None, to_plot_data_y_test_pred)
    

    plot_date_test = date_data[-plot_range+n_preds:].tolist()
    last_day = date_data[-1]
    for n in range(n_preds):
        date = datetime.strptime(last_day, "%Y-%m-%d")
        last_day_dt = date + timedelta(days=1)
        last_day = datetime.strftime(last_day_dt, "%Y-%m-%d")

        plot_date_test.append(last_day)
    

    print("Predicted close price of the next trading day:", next_n_predictions)


    return to_plot_data_y_val, to_plot_data_y_val_pred, to_plot_data_y_test_pred, plot_date_test
    



# data config
window_size = 10
train_size = 0.80 # % of data to use for training

# model config
num_features = 19 # number of input features (number of columns in the dataframe)
batch_size = 64
num_lstm_layers = 2
lstm_size = 32 # 128 # 32
dropout = 0.20
num_epochs = 100
learning_rate = 0.01
scheduler_step_size = 40

device = 'cpu'


# if we just use TA indictaors for training, then we can recompute them for our "predictions" and re-feed it into the model to
# get the predictions for further out than 1 day
# -------------------------------------------------------------------------------------------------------------------------------------- #
def get_data(ticker):
    # df = yf.download(ticker, period='max', interval='1d')
    df = yf.download(ticker, period='1y', interval='1d')
    df.columns = [c.replace(' ', '_').lower() for c in df.columns]
    df.reset_index(inplace=True)
    # date_data = np.array(df['Date'].astype(str))
    # df = df.drop(['Date'], axis=1)
    feat_names = df.columns.values.tolist()
    feat_names.remove('adj_close')
    feat_names.remove('Date')
    feat_names.remove('volume')

    # add technical indicators
    # Do 3, 5, 10 SMA/EMA
    df.ta.sma(close="adj_close", length=3, append=True)
    df.ta.sma(close="adj_close", length=5, append=True)
    df.ta.sma(close="adj_close", length=10, append=True)

    df.ta.ema(close="adj_close", length=3, append=True)
    df.ta.ema(close="adj_close", length=5, append=True)
    df.ta.ema(close="adj_close", length=10, append=True)

    # returns
    df.ta.log_return(close='adj_close', cumulative=True, append=True)
    df.ta.percent_return(close='adj_close', cumulative=True, append=True)

    # Bollinger Bands
    df.ta.bbands(close='adj_close', length=10, deviation=2, append=True)

    # Add VWAP, MACD, RSI
    df.set_index(pd.DatetimeIndex(df["Date"]), inplace=True)
    df.ta.vwap(close="adj_close", append=True)
    df.ta.rsi(close="adj_close", append=True)
    df.ta.aroon(close="adj_close", append=True)
    
    
    date_data = np.array(df['Date'].astype(str))    
    df = df.drop(['Date'], axis=1)
    # df.drop(['volume'], axis=1, inplace=True) # fucks everything up
    df.drop(feat_names, axis=1, inplace=True)
    
    # pprint(df)
    df = df.iloc[window_size+4:]
    # pprint(df)

    feature_names = df.columns.values
    print(feature_names)
    features = df.to_numpy()
    num_data_points = features.shape[0]
    date_data = date_data[window_size+4:]
    
    display_date_range = 'from ' + date_data[0] + ' to ' + date_data[-1]
    print('Number data points', num_data_points, display_date_range)

    return date_data, features, num_data_points, display_date_range


class Normalizer():
    def __init__(self):
        self.mu = None
        self.sd = None

    def fit_transform(self, x):
        self.mu = np.mean(x, axis=(0), keepdims=True)
        self.sd = np.std(x, axis=(0), keepdims=True)
        normalized_x = (x - self.mu)/self.sd
        return normalized_x

    def inverse_transform(self, x):
        return (x*self.sd) + self.mu


def prepare_data_x(x, window_size):
    n_row = x.shape[0] - window_size + 1

    output = np.zeros((n_row, window_size, x.shape[1]))
    for i in range(n_row):
        output[i] = x[i:i+window_size]
        

    return output[:-1], output[-1]


def prepare_data_y(x, window_size):
    # # perform simple moving average
    # output = np.convolve(x, np.ones(window_size), 'valid') / window_size

    # use the next day as label
    output = x[window_size:]
    return output


class TimeSeriesDataset(Dataset):
    def __init__(self, x, y):
        # x = np.expand_dims(x, 2)  # in our case, we have only 1 feature, so we need to convert `x` into [batch, sequence, features] for LSTM
        self.x = x.astype(np.float32)
        self.y = y.astype(np.float32)

    def __len__(self):
        return len(self.x)

    def __getitem__(self, idx):
        return (self.x[idx], self.y[idx])



class LSTMModel(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=32, num_layers=2, output_size=1, dropout=0.2):
        super().__init__()
        self.hidden_layer_size = hidden_layer_size

        self.linear_1 = nn.Linear(input_size, hidden_layer_size)
        self.relu = nn.ReLU()
        self.lstm = nn.LSTM(hidden_layer_size, hidden_size=self.hidden_layer_size, num_layers=num_layers, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.linear_2 = nn.Linear(num_layers * hidden_layer_size, output_size)

        self.init_weights()

    def init_weights(self):
        for name, param in self.lstm.named_parameters():
            if 'bias' in name:
                nn.init.constant_(param, 0.0)
            elif 'weight_ih' in name:
                nn.init.kaiming_normal_(param)
            elif 'weight_hh' in name:
                nn.init.orthogonal_(param)

    def forward(self, x):
        batchsize = x.shape[0]

        # layer 1
        x = self.linear_1(x)
        x = self.relu(x)

        # LSTM layer
        lstm_out, (h_n, c_n) = self.lstm(x)

        # reshape output from hidden cell into [batch, features] for `linear_2`
        x = h_n.permute(1, 0, 2).reshape(batchsize, -1)

        # layer 2
        x = self.dropout(x)
        predictions = self.linear_2(x)
        return predictions[:, -1]


def run_epoch(model, optimizer, scheduler, criterion, dataloader, is_training=False):
    epoch_loss = 0

    if is_training:
        model.train()
    else:
        model.eval()

    for idx, (x, y) in enumerate(dataloader):
        if is_training:
            optimizer.zero_grad()

        batchsize = x.shape[0]

        x = x.to(device)
        y = y.to(device)

        out = model(x)
        loss = criterion(out.contiguous(), y.contiguous())

        if is_training:
            loss.backward()
            optimizer.step()

        epoch_loss += (loss.detach().item() / batchsize)

    lr = scheduler.get_last_lr()[0]

    return epoch_loss, lr
