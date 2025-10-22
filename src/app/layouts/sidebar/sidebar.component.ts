import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { HostListener } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserSummaryResponseDto } from '../../core/models/auth.model';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button.component';
import { AvatarComponent } from '../../shared/components/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ButtonComponent, AvatarComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isMenuOpen: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();

  isLoggedIn$: Observable<boolean>;
  userProfile$: Observable<UserSummaryResponseDto | null>;

  constructor(private authService: AuthService, private router: Router) { 
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userProfile$ = this.authService.currentUserProfile$;
  }

  onCloseMenu() {
    this.closeMenu.emit();
  }
  
  navigateToLogin() {
    this.onCloseMenu(); 
    this.router.navigate(['/login']); 
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.onCloseMenu();
    }
  }
}