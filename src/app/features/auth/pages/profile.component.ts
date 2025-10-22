import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserSummaryResponseDto } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ImageService } from '../../../core/services/image.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UpdateProfileImageRequestDto } from '../../../core/models/user.model';
import { AvatarComponent } from '../../../shared/components/avatar.component';
import { IMAGE_TYPES } from '../../../core/constants/image-types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile$: Observable<UserSummaryResponseDto | null>;
  selectedImageId: string | null = null;
  isUploading = false;
  isSettingProfile = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.userProfile$ = this.authService.currentUserProfile$;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.notificationService.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.error('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.isUploading = true;
    
    this.imageService.uploadImage(file, IMAGE_TYPES.USER_PROFILE).subscribe({
      next: (response) => {
        this.selectedImageId = response.imageId;
        this.notificationService.success('Imagem enviada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao enviar imagem:', err);
        
        // Tratar diferentes tipos de erro
        if (err.status === 400) {
          if (err.error?.detail?.includes('Invalid ImageType')) {
            this.notificationService.error('Tipo de imagem inválido. Use apenas imagens de perfil.');
          } else {
            this.notificationService.error('Arquivo inválido. Verifique o formato e tamanho da imagem.');
          }
        } else if (err.status === 405) {
          this.notificationService.error('Método não permitido. Verifique se o endpoint está correto.');
        } else if (err.status === 413) {
          this.notificationService.error('Arquivo muito grande. Reduza o tamanho da imagem.');
        } else {
          this.notificationService.error('Erro ao enviar imagem. Tente novamente.');
        }
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  setAsProfileImage(): void {
    if (!this.selectedImageId) return;

    this.isSettingProfile = true;
    const updateData: UpdateProfileImageRequestDto = {
      imageId: this.selectedImageId
    };

    this.userService.updateProfileImage(updateData).subscribe({
      next: (response) => {
        this.notificationService.success('Foto de perfil atualizada com sucesso!');
        this.selectedImageId = null;
      },
      error: (err) => {
        console.error('Erro ao definir imagem de perfil:', err);
        this.notificationService.error('Erro ao definir imagem de perfil. Tente novamente.');
      },
      complete: () => {
        this.isSettingProfile = false;
      }
    });
  }


  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}