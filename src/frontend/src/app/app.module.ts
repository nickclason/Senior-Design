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
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { SidebarModule, MenuAllModule, TreeViewModule, TreeViewAllModule} from '@syncfusion/ej2-angular-navigations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortfolioChartComponent } from './portfolio-chart/portfolio-chart.component';
import { RegisterComponent } from './register/register.component';


import { CandleSeriesService, CategoryService, DataLabelService, DateTimeService, 
  LegendService, LineSeriesService, TooltipService, StockChartModule, StockChartAllModule, } from '@syncfusion/ej2-angular-charts';
import { PortfolioHoldingsComponent } from './portfolio-holdings/portfolio-holdings.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';

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
    AddTransactionComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    DashboardLayoutModule,
    DropDownListModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ListViewAllModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MenuAllModule,
    OverlayModule,
    RadioButtonModule,
    ReactiveFormsModule,
    SidebarModule,
    StockChartAllModule,
    StockChartModule,
    TreeViewAllModule,
    TreeViewAllModule,
  ],
  providers: [CandleSeriesService, CategoryService, DataLabelService, DateTimeService, LegendService, LineSeriesService, TooltipService],
  bootstrap: [AppComponent]
})
export class AppModule { }


// SidebarModule, BrowserModule, RadioButtonModule, MenuAllModule, DropDownListModule, ButtonModule, TreeViewAllModule, ListViewAllModule