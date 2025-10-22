import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Output() clickEvent = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clickEvent.emit();
    }
  }
}
