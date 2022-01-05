import { Component, OnInit } from '@angular/core';

// User-defined imports
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  message = '';
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.deauthenticate().subscribe(
      () => {
        console.log("logging out");
        this.router.navigate(['/']); // redirect to home page
      },
      (error) => {
        this.message = error;
      }
    );
  }
}
