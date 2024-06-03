import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = new FormBuilder();
  private authService = inject( AuthService )
  private router = inject( Router );

  public myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]]
  })


  isValidField( field: string): boolean | null {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched;
  }

  getFieldError( field: string): string | null {
    if ( !this.myForm.controls[field] ) return null;

    const errors = this.myForm.controls[field].errors || {};
    for ( const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return "Este campo es obligatorio";

        case 'minlength':
          return `Minimo ${ errors['minlength'].requiredLength } caracteres.`

        case 'email':
          return `El email no es valido`
      }
    }

    return null
  }
  login() {
    const { username, password } = this.myForm.value;
    this.authService.login( username, password )
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: ( error ) => {
          Swal.fire('Error', error, 'error')
        }
      })
  }
}
