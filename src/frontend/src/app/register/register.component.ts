import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";


// make this component available to the app somehow
export interface Response {
  message: string
}



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  message: string;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    
    this.registerForm = this.fb.group({
      email: '',
      username: '',
      password: ''
    })

    // this.registerForm.valueChanges.subscribe(console.log) // this logs every value change
  }


  onRegister() {
    console.log('email: ' + this.registerForm.get('email')?.value)
    console.log('username: ' + this.registerForm.get('username')?.value)
    console.log('password: ' + this.registerForm.get('password')?.value)

    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let user = { email: this.registerForm.get('email')?.value, 
                 username: this.registerForm.get('username')?.value, 
                 password: this.registerForm.get('password')?.value }

    let url = 'http://localhost:5000/api/auth/register'

    return this.http.post<Response>(url, user, httpOptions).subscribe(
      response => {
        console.log(response)
        this.message = response.message
      })
  
  }
}