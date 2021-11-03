import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    { // Home
      path: '',
      component: HomeComponent,
      // canActivate: [AuthGuard], // Doing this forces a redirect to login if not logged in immediately upon opening the site
      canActivateChild: [AuthGuard],
      children: [
        {
          path: 'denied',
          component: AccessDeniedComponent
        }
      ]
    }, 
    { // Login
      path: 'login',
      component: LoginComponent 
    },
    { // Logout
      path: 'logout',
      component: LogoutComponent,
      canActivate: [AuthGuard]
    },
    { // Register
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard]
    },

    // // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }