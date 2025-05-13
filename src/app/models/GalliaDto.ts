// gallia.dto.ts
export interface GalliaDto {
  galliaId: number;
  labelDate: Date | null;
  createdAt: Date;
  fields: GalliaFieldDto[];
  labelImage?: string;
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

export class LabelImageDto {
  constructor(
    public galliaId: number,
    public base64Image: string
  ) {}
}