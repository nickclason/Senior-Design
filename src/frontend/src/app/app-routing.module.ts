import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AuthGuard } from './services/auth.guard';

import { AppComponent } from './app.component';
// End User Defined Imports
// -----------------------------------------------------------------------------

const routes: Routes = [
  { // Home
    path: '',
    component: AppComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
