import { Component, OnInit } from '@angular/core';

// User-defined imports
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from '@angular/router';
import {DataService} from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  loggedIn: boolean = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    // TODO: issue a GET to /api/auth/login to check if the user is already logged in
    
    this.dataService.alreadyLoggedIn().subscribe(
      (data: any) => {
        
        console.log(data)

        if (data.UserData) {
          this.router.navigate(['profile']);
        }
        
      })
  }

  onLogin() {
    this.dataService.login(this.profileForm.get('email')?.value, this.profileForm.get('password')?.value, this.router);
  }

}