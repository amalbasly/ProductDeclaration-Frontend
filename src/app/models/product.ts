// src/app/models/product.ts

/* Core Product Interface (matches C# ProduitSerialiséDto) */
export interface ProduitSerialiséDto {
  LpNum: string;         // Matches [FromForm(Name = "Ligne")]
  FpCod: string;         // Famille
  SpCod: string;         // Sous-Famille
  PtNum: string;         // Code Produit
  PtLib: string;         // Libellé
  SpId: string;          // Statut
  IsSerialized: boolean;
  PtPoids: number | null;
  PtDcreat: Date | null;
  TpCod?: string | null; // Type
  PtLib2?: string | null; // Libellé 2
  PtSpecifT14?: string | null; // Code Client (C264)
  PtCreateur?: string | null; // Créé par
  PtSpecifT15?: string | null; // Tolerance
  PtFlasher?: number | null; // Flashable
}

/* Response Interfaces */
export interface ProductResult {
  Result: string;
  Message: string;
  ProductCode?: string;
  Products?: ProduitSerialiséDto[];
  IsSerialized?: boolean;
}

// Alias for backward compatibility
export interface ProductResponse extends ProductResult {
  FilterCriteria?: {
    CodeProduit?: string | null;
    status?: string | null;
    isSerialized?: boolean | null;
  };
}

/* Options Interface */
export interface ProductOptionResponse {
  Lignes: string[];
  Famille: string[];
  SousFamilles: string[];
  Types: string[];
  Statuts: string[];
}

// Alias for backward compatibility
export interface DropdownOptions extends ProductOptionResponse {}

/* Create Response */
export interface ProductCreateResponse {
  Result: string;
  Message: string;
  ProductCode: string;
  IsSerialized: boolean;
}

/* Validation Interface */
export interface ProductCodeCheck {
  Exists: boolean;
}

/* Form Data Interface */
export interface CreateProductFormData {
  Ligne: string;
  Famille: string;
  SousFamille: string;
  CodeProduit: string;
  Libelle: string;
  IsSerialized: boolean;
  Type?: string;
  Libelle2?: string;
  Statut?: string;
  CodeProduitClientC264?: string;
  Poids?: number | null;
  Createur?: string;
  DateCreation?: Date | null;
  Tolerance?: string;
  Flashable?: number | null;
}