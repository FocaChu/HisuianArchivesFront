import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../shared/components/button.component';
import { AvatarComponent } from '../../shared/components/avatar.component';
import { AuthService } from '../../core/services/auth.service';
import { UserSummaryResponseDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent, AvatarComponent]
})
export class HeaderComponent {
  @Input() isMenuOpen: boolean = false; 
  
  @Output() menuToggle = new EventEmitter<void>();

  isLoggedIn$: Observable<boolean>;
  userProfile$: Observable<UserSummaryResponseDto | null>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userProfile$ = this.authService.currentUserProfile$;
  }

  onToggleMenu() {
    this.menuToggle.emit();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  logout(): void {
    this.authService.logout();
  }
}