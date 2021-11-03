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

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    console.log("logging out");
    this.auth.deauthenticate().subscribe(
      () => {
        this.router.navigate(['/login']);
      }
    );
  }
}
