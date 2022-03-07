import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResizeEventArgs } from '@syncfusion/ej2-angular-layouts';
import { PortfolioChartComponent } from '../portfolio-chart/portfolio-chart.component';
import { PredictionChartComponent } from '../prediction-chart/prediction-chart.component';
import { SectorChartComponent } from '../sector-chart/sector-chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  public cellSpacing: number[] = [10, 10];
  public mediaQuery: string = 'max-width: 700px';


  @ViewChild('portfolioChart') portfolioChart: PortfolioChartComponent;
  @ViewChild('sectorChart') sectorChart: SectorChartComponent;
  @ViewChild('predictionChart') predictionChart: PredictionChartComponent;

  private eventTrace: string = '';

  public afterResize(args: ResizeEventArgs): void {
    this.updateEventLog(args);
    // console.log(this.eventTrace);

    // This is probably not the best way to do this, as it happens when ANY tile is resized....
    // But it works!
    this.portfolioChart.ngOnInit();
    this.sectorChart.ngOnInit();
    this.predictionChart.ngOnInit();
  }

  private updateEventLog(args: any): void {
    this.eventTrace = this.eventTrace + args.name + ' Event triggered. <br />'
}
}