import { Component, ViewEncapsulation } from '@angular/core';
import { ResizeEventArgs } from '@syncfusion/ej2-angular-layouts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  public cellSpacing: number[] = [10, 10];
  public mediaQuery: string = 'max-width: 700px';


  private eventTrace: string = '';

  public afterResize(args: ResizeEventArgs): void {
    this.updateEventLog(args);
    console.log(this.eventTrace);
  }

  private updateEventLog(args: any): void {
    this.eventTrace = this.eventTrace + args.name + ' Event triggered. <br />'
}
}