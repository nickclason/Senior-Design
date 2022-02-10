import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
// End User Defined Imports
// -----------------------------------------------------------------------------

const routes: Routes = [
  { // Home
    path: '',
    component: HomeComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'denied',
        component: AccessDeniedComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
