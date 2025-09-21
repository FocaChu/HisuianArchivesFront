import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HealthCheckResponse } from '../models/health-check.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private baseUrl = environment.baseUrl;

  private get aPIOptions() {
    return {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true' 
      })
    };
  }

  constructor(private http: HttpClient) { }

  healthCheck(): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(`${this.baseUrl}/health`, this.aPIOptions);
  }