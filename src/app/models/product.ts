export interface ProduitSerialiséDto {
  ptNum: string;
  ptLib: string;
  fpCod: string;
  spCod: string;
  spId: string;
  isSerialized: boolean;
  ptPoids: number | null;
  ptDcreat: Date | null;
}


export interface ProductResponse {
  Result: string;
  Message: string;
  Products: ProduitSerialiséDto[];
  FilterCriteria?: {
    CodeProduit?: string | null;
    status?: string | null;
    isSerialized?: boolean | null;
  };
}

export interface DropdownOptions {
  lignes: string[];
  famille: string[];
  sousFamilles: string[];
  types: string[];
  statuts: string[];
}

export interface ProductCreateResponse {
  result: string;
  message: string;
  productCode: string;
}

export interface ProductCodeCheck {
  exists: boolean;
}