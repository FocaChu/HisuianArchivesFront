import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImageUploadResponseDto } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File, imageType: string): Observable<ImageUploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageType', imageType);

    return this.http.post<ImageUploadResponseDto>(`${this.apiUrl}/upload`, formData);
  }
}
