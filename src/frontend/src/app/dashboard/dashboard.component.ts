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
  enabled: boolean = true;


  @ViewChild('portfolioChart') portfolioChart: PortfolioChartComponent;
  @ViewChild('sectorChart') sectorChart: SectorChartComponent;
  @ViewChild('predictionChart') predictionChart: PredictionChartComponent;

  public afterResize(args: ResizeEventArgs): void {

    this.portfolioChart.ngOnInit();
    this.sectorChart.ngOnInit();
    // this.predictionChart.ngOnInit();
    this.reloadTree();
  }

  reloadTree(){
    this.enabled = false;
    const self = this;
    setTimeout(function(){
      self.enabled = true;
    }, 1);
  }

}