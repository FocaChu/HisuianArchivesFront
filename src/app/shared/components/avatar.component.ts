import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="getSizeClasses()" class="bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
      <img 
        *ngIf="imageId" 
        [src]="getImageUrl()" 
        [alt]="'Foto de perfil de ' + userName"
        class="w-full h-full object-cover"
      />
      <svg 
        *ngIf="!imageId" 
        [ngClass]="getIconSizeClasses()" 
        class="text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
      </svg>
    </div>
  `,
  styles: []
})
export class AvatarComponent {
  @Input() imageId?: string;
  @Input() userName: string = 'User';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  getSizeClasses(): string {
    const sizeMap = {
      'sm': 'w-8 h-8',
      'md': 'w-12 h-12',
      'lg': 'w-16 h-16',
      'xl': 'w-32 h-32'
    };
    return sizeMap[this.size];
  }

  getIconSizeClasses(): string {
    const iconSizeMap = {
      'sm': 'w-4 h-4',
      'md': 'w-6 h-6',
      'lg': 'w-8 h-8',
      'xl': 'w-16 h-16'
    };
    return iconSizeMap[this.size];
  }

  getImageUrl(): string {
    return `${environment.baseUrl}/images/${this.imageId}`;
  }
}
