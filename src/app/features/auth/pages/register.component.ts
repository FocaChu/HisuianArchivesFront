import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RegisterRequestDto } from '../../../core/models/auth.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ButtonComponent } from "../../../shared/components/button.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private notificationService: NotificationService,
    private router: Router
  ) { }

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
        this.notificationService.success('Cadastro realizado com sucesso!');
      },
      error: (err) => {
        console.error('Falha no registro', err);
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error; 
          this.notificationService.error(err.error.error);
        } else {
          this.errorMessage = 'Ocorreu um erro durante o registro. Tente novamente.';
          this.notificationService.error('Ocorreu um erro durante o registro. Tente novamente.');
        }
      }
    });
  }
}