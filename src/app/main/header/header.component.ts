import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe]
})
export class HeaderComponent {
  @Input() isMenuOpen: boolean = false; 
  
  @Output() menuToggle = new EventEmitter<void>();

  onToggleMenu() {
    this.menuToggle.emit();
  }
}