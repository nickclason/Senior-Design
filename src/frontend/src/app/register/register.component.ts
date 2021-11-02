import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

  username: string;
  password: string;
  minPwChar: number = 8

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  minPwLength: number = 8;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password1: ['', [Validators.required, Validators.minLength(this.minPwChar)]],
      password2: ['', [Validators.required]]
    }, {validator: this.passwordMatchValidator})
  }


  passwordMatchValidator(g: FormGroup) {
    return g.get('password1')?.value === g.get('password2')?.value
       ? null : {'mismatch': true};
  }

  get password1() { return this.registerForm.get('password1'); }
  get password2() { return this.registerForm.get('password2'); }

  onPasswordInput() {
    if (this.registerForm.hasError('passwordMismatch'))
      this.password2?.setErrors([{'passwordMismatch': true}]);
    else
      this.password2?.setErrors(null);
  }


  onRegister() {
    let user = { email: this.username,
                 password: this.password,
                 firstName: this.registerForm.get('firstName')?.value,
                 lastName: this.registerForm.get('lastName')?.value }

    let url = 'http://localhost:5000/api/auth/register'

    return this.http.post<Response>(url, user).subscribe(
      response => {
        console.log(response)
        this.message = response.message
      })
  
  }
}