import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserSummaryResponseDto } from '../../../core/models/auth.model';
import { UserUpdateProfileRequestDto } from '../../../core/models/user.model';
import { TranslatePipe } from "../../../shared/pipes/translate.pipe";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Editar Perfil</h2>
      
      <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="{{ 'COMMON.VALIDATION.EDIT_NAME_PLACEHOLDER' | translate }}"
          />
          <div *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched" 
               class="text-red-500 text-sm mt-1">
            Nome é obrigatório
          </div>
        </div>

        <div class="mb-6">
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            formControlName="bio"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="{{ 'COMMON.VALIDATION.BIOGRAPHY_PLACEHOLDER' | translate }}"
          ></textarea>
        </div>

        <div class="flex space-x-4">
          <button
            type="submit"
            [disabled]="editForm.invalid || isLoading"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Salvar Alterações</span>
            <span *ngIf="isLoading">Salvando...</span>
          </button>
          
          <button
            type="button"
            (click)="goBack()"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EditProfileComponent implements OnInit, OnDestroy {
  editForm!: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      bio: new FormControl('')
    });

    // Pre-fill form with current user data
    this.authService.currentUserProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.editForm.patchValue({
            name: user.name,
            bio: user.bio || ''
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updateData: UserUpdateProfileRequestDto = this.editForm.value;

    this.userService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.notificationService.success('NOTIFICATIONS.SUCCESS.PROFILE_UPDATED');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.notificationService.error('NOTIFICATIONS.ERROR.PROFILE_UPDATE_FAILED');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
