import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CustomSidebarComponent } from './sidebar/custom-sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { SidebarModule, MenuAllModule, TreeViewModule, TreeViewAllModule} from '@syncfusion/ej2-angular-navigations';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortfolioChartComponent } from './portfolio-chart/portfolio-chart.component';
import { RegisterComponent } from './register/register.component';
import { AccumulationChartAllModule, CandleSeriesService, CategoryService, ChartAllModule,
         DataLabelService, DateTimeService, LegendService, LineSeriesService,
        TooltipService, RangeNavigatorAllModule, StockChartModule, StockChartAllModule, 
        ChartAnnotationService} from '@syncfusion/ej2-angular-charts';
import { PortfolioHoldingsComponent } from './portfolio-holdings/portfolio-holdings.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SectorChartComponent } from './sector-chart/sector-chart.component';



import { TreeMapModule, TreeMapLegendService, TreeMapTooltipService, TreeMapAllModule } from '@syncfusion/ej2-angular-treemap';
import { PredictionChartComponent } from './prediction-chart/prediction-chart.component';
import { HomeComponent } from './home/home.component';



import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StockInfoComponent } from './stock-info/stock-info.component';
import { MarketNewsComponent } from './market-news/market-news.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { SenateInfoComponent } from './senate-info/senate-info.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';


// End User Defined Imports
// -----------------------------------------------------------------------------
@NgModule({
  declarations: [
    AccessDeniedComponent,
    AppComponent,
    CustomSidebarComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    PortfolioChartComponent,
    PortfolioHoldingsComponent,
    AddTransactionComponent,
    WatchlistComponent,
    SectorChartComponent,
    PredictionChartComponent,
    HomeComponent,
    StockInfoComponent,
    MarketNewsComponent,
    HouseInfoComponent,
    SenateInfoComponent,
    LearnMoreComponent
  ],
  imports: [
    AppRoutingModule,
    AccumulationChartAllModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    ChartAllModule,
    DashboardLayoutModule,
    DropDownListModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ListViewAllModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MenuAllModule,
    OverlayModule,
    RadioButtonModule,
    RangeNavigatorAllModule,
    ReactiveFormsModule,
    SidebarModule,
    StockChartAllModule,
    StockChartModule,
    TreeMapAllModule,
    TreeMapModule,
    TreeViewAllModule,
    TreeViewModule,
  ],
  providers: [CandleSeriesService, CategoryService, DataLabelService, DateTimeService, LegendService, LineSeriesService, 
              TreeMapLegendService, TreeMapTooltipService, TooltipService],
  bootstrap: [AppComponent]
})
export class AppModule { }

