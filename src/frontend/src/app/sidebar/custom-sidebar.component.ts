import { Component } from '@angular/core';

// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AuthService } from '../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { ViewChild } from '@angular/core';
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


  constructor(private auth: AuthService, private dialog: MatDialog) { }
  
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
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
