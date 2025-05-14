import { SafeUrl } from '@angular/platform-browser';

export interface GalliaDto {
  galliaId: number;
  labelDate: Date | null;
  createdAt: Date;
  fields: GalliaFieldDto[];
  labelImage?: SafeUrl;
}

export interface GalliaFieldDto {
  galliaFieldId?: number;
  galliaId?: number;
  fieldName?: string | null;
  fieldValue: string;
  displayOrder: number;
  visualizationType: string;
}

export interface CreateGalliaFieldDto {
  fieldValue: string;
  displayOrder: number;
  visualizationType: string;
  fieldName?: string | null;
}

export interface CreateGalliaDto {
  labelDate?: Date | null;
  fields: CreateGalliaFieldDto[];
}

export interface UpdateGalliaDto {
  galliaId: number;
  labelDate?: Date | null;
  fields: GalliaFieldDto[];
}

export interface LabelImageDto {
  galliaId: number;
  base64Image: string;
  savePath: string;  // Add this property
}