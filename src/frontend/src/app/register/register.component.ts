import { Component, OnInit } from '@angular/core';



// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
// End User Defined Imports
// -----------------------------------------------------------------------------

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

  constructor(private fb: FormBuilder, private auth: AuthService, public dialogRef: MatDialogRef<RegisterComponent>) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password1: ['', [Validators.required, Validators.minLength(this.minPwLength)]],
      password2: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator })
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password1')?.value === g.get('password2')?.value
      ? null : { 'mismatch': true };
  }

  get password1() { return this.registerForm.get('password1'); }
  get password2() { return this.registerForm.get('password2'); }

  onPasswordInput() {
    if (this.registerForm.hasError('mismatch'))
      this.password2?.setErrors([{ 'pwMatchError': true }]);
    else
      this.password2?.setErrors(null);
  }

  // TODO: Here what I'm trying to do is register the user, if successful, then log in.
  // Doesn't seem to be working so for the time being I'm just going to redirect them to loging page
  onRegister() {
    this.auth.registerUser(this.registerForm.get('firstName')!.value, this.registerForm.get('lastName')!.value, this.email, this.password).subscribe(
      () => {
        // console.log("User registered successfully!");
        this.registerForm.reset();
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
      });
  }

}