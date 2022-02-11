import { Component } from '@angular/core';

// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { ViewChild } from '@angular/core';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
// End User Defined Imports
// -----------------------------------------------------------------------------

@Component({
  selector: 'app-custom-sidebar',
  templateUrl: './custom-sidebar.component.html',
  styleUrls: ['./custom-sidebar.component.scss']
})
export class CustomSidebarComponent {
  
  @ViewChild('dockBar') dockBar: SidebarComponent;
  public enableDock: boolean = true;
  public width: string = '220px';
  public dockSize: string = '72px';
  
  toggleClick() {
    this.dockBar.toggle();
  }
}
