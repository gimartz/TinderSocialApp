// FILE: src/types/menu.ts
export interface MenuItemOptionChoice {
  name: string;
  price: number;
}

export interface MenuItemOption {
  name: string;
  choices: MenuItemOptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  isAvailable: boolean;
  images: string[]; // This is an array, not a single imageUrl
  imageUrl: string | undefined;
  estimatedPreparationTime?: number;
  isFeatured?: boolean;
  popularity?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  ingredients?: string[] | null;
  options?: MenuItemOption[];
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  restaurantId?: string;
  isSystemCategory?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditModalProps {
  visible: boolean;
  item: MenuItem | Category | null;
  onSave: (id: string, data: any) => void;
  onClose: () => void;
  isCategory?: boolean;
  isLoading?: boolean; // Add loading state
  isSuccess?: boolean; // Add success state
}

export interface ImageUploadState {
  selectedImagePreviews: string[];
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccessMessage: string | null;
}

export interface MenuItemsResponse {
  success: boolean;
  data: MenuItem[];
}
