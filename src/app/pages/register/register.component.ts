import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequestDto } from '../../core/models/auth.model';
import { TranslatePipe } from "../../shared/pipes/translate.pipe";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]), 
      bio: new FormControl('') 
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const registerData: RegisterRequestDto = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido!', response);
      },
      error: (err) => {
        console.error('Falha no registro', err);
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error; 
        } else {
          this.errorMessage = 'Ocorreu um erro durante o registro. Tente novamente.';
        }
      }
    });
  }
}