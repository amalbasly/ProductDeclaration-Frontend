import { SafeUrl } from '@angular/platform-browser';

// Returned Gallia object (read/view mode)
export interface GalliaDto {
  galliaId: number;
  labelDate: Date | null;
  createdAt: Date;
  fields: GalliaFieldDto[];
  labelImage?: SafeUrl;
  labelName: string;
  galliaName?: string | null; // Add galliaName
}

// Field structure for returned Gallia
export interface GalliaFieldDto {
  galliaFieldId?: number;
  galliaId?: number;
  fieldName?: string | null;
  fieldValue: string;
  displayOrder: number;
  visualizationType: string;
}

// Field structure for creating Gallia
export interface CreateGalliaFieldDto {
  fieldValue: string;
  displayOrder: number;
  visualizationType: string;
  fieldName?: string | null;
}

// Used when creating a Gallia or Etiquette
export interface CreateGalliaDto {
  labelDate?: Date | null;
  fields: CreateGalliaFieldDto[];
  labelName: string; // Must be "Gallia" or "Etiquette"
  galliaName?: string | null; // Add galliaName
}

// Used when updating a Gallia or Etiquette
export interface UpdateGalliaDto {
  galliaId: number;
  labelDate?: Date | null;
  fields: GalliaFieldDto[];
  labelName: string; // Must be preserved or updated
  galliaName?: string | null; // Add galliaName
}

// Structure for storing the label image
export interface LabelImageDto {
  galliaId: number;
  base64Image: string;
  savePath: string;
}