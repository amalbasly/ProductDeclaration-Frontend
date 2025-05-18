import { SafeUrl } from '@angular/platform-browser';

// Returned Gallia object (read/view mode)
export interface GalliaDto {
  galliaId: number;
  labelDate: Date | null;
  createdAt: Date;
  fields: GalliaFieldDto[];
  labelImage?: SafeUrl | string; // Support both SafeUrl and base64 string
  labelName: string;
  galliaName?: string | null;
}

// Field structure for returned Gallia
export interface GalliaFieldDto {
  galliaFieldId?: number;
  galliaId?: number;
  fieldName?: string | null;
  fieldValue: string;
  displayOrder: number;
  visualizationType: 'qrcode' | 'barcode' | 'datametrics';
}

// Field structure for creating Gallia
export interface CreateGalliaFieldDto {
  fieldValue: string;
  displayOrder: number;
  visualizationType: 'qrcode' | 'barcode' | 'datametrics';
  fieldName?: string | null;
}

// Used when creating a Gallia or Etiquette
export interface CreateGalliaDto {
  labelDate: string; // YYYY-MM-DD format
  fields: CreateGalliaFieldDto[];
  labelName: string; // Must be "Gallia" or "Etiquette"
  galliaName?: string | null;
}

// Used when updating a Gallia or Etiquette
export interface UpdateGalliaDto {
  galliaId: number;
  labelDate?: Date | null;
  fields: GalliaFieldDto[];
  labelName: string;
  galliaName?: string | null;
}

// Structure for storing the label image
export interface LabelImageDto {
  galliaId: number;
  base64Image: string;
  savePath: string;
}