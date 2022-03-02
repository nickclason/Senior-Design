import { Component, OnInit } from '@angular/core';

// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AuthService } from '../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog} from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
// End User Defined Imports
// -----------------------------------------------------------------------------

@Component({
  selector: 'app-custom-sidebar',
  templateUrl: './custom-sidebar.component.html',
  styleUrls: ['./custom-sidebar.component.scss']
})
export class CustomSidebarComponent implements OnInit {
  
  @ViewChild('dockBar') dockBar!: SidebarComponent;
  public enableDock: boolean = true;
  public width: string = '220px';
  public dockSize: string = '72px';

  public isAuthenticated: boolean = false;

  constructor(private auth: AuthService, private dataService: DataService, private dialog: MatDialog) { }
  
  ngOnInit() {
    this.auth.subscribe(resp => this.isAuthenticated = resp);
  }

  
  public hierarchicalData: Object[] = [
    { id: '01', name: 'Components', expanded: true,
         subChild: [
             {id: '01-01', name: 'Gouttes.mp3'},
                   ]
     },
 ];

 public hierarchicalData2: Object[] = [
  //will eventuall get around to adding the components in here? I think?
 ];

 public field:Object ={ dataSource: this.hierarchicalData, id: 'id', text: 'name', child: 'subChild' };

 public field2:Object ={
   dataSource: this.hierarchicalData2, id: 'id', text: 'name', child: 'subChild'
 }

  toggleClick() {
    this.dockBar.toggle();
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {});
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The login dialog was closed');
    });
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The register dialog was closed');
    });
  }

  onLogout() {
    this.auth.deauthenticate().subscribe(
      () => {
        console.log("logging out");
        this.dataService.clearAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
