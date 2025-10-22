import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent]
})
export class HeaderComponent {
  @Input() isMenuOpen: boolean = false; 
  
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private router: Router) {}

  onToggleMenu() {
    this.menuToggle.emit();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}