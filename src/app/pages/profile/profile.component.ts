import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserSummaryResponseDto } from '../../core/models/auth.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userProfile$: Observable<UserSummaryResponseDto | null>;

  constructor(private authService: AuthService) {
    this.userProfile$ = this.authService.currentUserProfile$;
  }
}