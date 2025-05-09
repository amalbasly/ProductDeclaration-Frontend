export interface GalliaDto {
  galliaId: number;
  pliB1: string | null;
  qliB3: string | null;
  liB1: string | null;
  liB2: string | null;
  liB3: string | null;
  liB4: string | null;
  liB5: string | null;
  liB6: string | null;
  liB7: string | null;
  supplierName: string | null;
  labelDate: Date | null;
  createdAt: Date;
  visualizationType?: 'qrcode' | 'barcode' | 'datametrics'; // ✅ Add this
}

  // create-gallia.dto.ts
// In your GalliaDto.ts file
export interface CreateGalliaDto {
  PLIB1?: string;
  QLIB3?: string;
  LIB1?: string;
  LIB2?: string;
  LIB3?: string;
  LIB4?: string;
  LIB5?: string;
  LIB6?: string;
  LIB7?: string;
  SupplierName?: string;
  LabelDate?: string;
  visualizationType?: 'qrcode' | 'barcode' | 'datametrics';
  [key: string]: any;
}
  
  // update-gallia.dto.ts
  export interface UpdateGalliaDto {
    GalliaId: number;
    PLIB1?: string | null;
    QLIB3?: string | null;
    LIB1?: string | null;
    LIB2?: string | null;
    LIB3?: string | null;
    LIB4?: string | null;
    LIB5?: string | null;
    LIB6?: string | null;
    LIB7?: string | null;
    SupplierName?: string | null;
    LabelDate?: Date | null;
  }