import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { LoggerService } from '../../shared/services/logger.service';
import { HealthCheckResponse } from '../../core/models/health-check.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "../../shared/pipes/translate.pipe"; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  healthStatus: 'connecting' | 'healthy' | 'unhealthy' = 'connecting';
  backendResponse: HealthCheckResponse | null = null;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.log('HomeComponent: Starting health check...');
    this.apiService.healthCheck().subscribe({
      next: (response) => {
        this.logger.log('HomeComponent: Health Check response received successfully!', response);
        this.backendResponse = response;
        this.healthStatus = response.status === 'Healthy' ? 'healthy' : 'unhealthy';
      },
      error: (err) => {
        this.logger.error('HomeComponent: Failed to connect to backend!', err);
        this.healthStatus = 'unhealthy';
        this.errorMessage = 'Could not connect to API. Please check if the backend and ngrok are running and if the CORS configuration is correct.';
      }
    });
  }
}