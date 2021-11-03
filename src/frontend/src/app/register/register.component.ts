import { Component, OnInit } from '@angular/core';

// User-defined imports
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  email: string;
  password: string;
  minPwLength: number = 8;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password1: ['', [Validators.required, Validators.minLength(this.minPwLength)]],
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
    if (this.registerForm.hasError('mismatch'))
      this.password2?.setErrors([{'pwMatchError': true}]);
    else
      this.password2?.setErrors(null);
  }


  onRegister() {
  }

}