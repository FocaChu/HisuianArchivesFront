import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginRequestDto } from '../../../core/models/auth.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null; 

    const credentials: LoginRequestDto = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.notificationService.success('NOTIFICATIONS.SUCCESS.LOGIN');
      },
      error: (err) => {
        console.error('Falha no login', err);
        this.errorMessage = 'NOTIFICATIONS.ERROR.LOGIN_FAILED';
        this.notificationService.error('NOTIFICATIONS.ERROR.LOGIN_FAILED');
      }
    });
  }
}