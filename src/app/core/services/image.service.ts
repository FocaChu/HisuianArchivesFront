import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImageUploadResponseDto } from '../models/image.model';
import { IMAGE_TYPES, ImageType } from '../constants/image-types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File, imageType: ImageType = IMAGE_TYPES.USER_PROFILE): Observable<ImageUploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageType', imageType);

    console.log('Uploading image:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageType: imageType,
      endpoint: `${this.apiUrl}/upload`
    });

    // Don't manually set Content-Type for multipart/form-data
    // Angular should set it automatically with boundary
    return this.http.post<ImageUploadResponseDto>(`${this.apiUrl}/upload`, formData);
  }
}
