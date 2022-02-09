import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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
