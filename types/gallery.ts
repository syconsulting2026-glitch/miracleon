export interface GalleryImageItem {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  fileUrl: string;
  sortOrder: number;
  isThumbnail: boolean;
  createdAt?: string;
}

export interface GalleryListItem {
  id: number;
  title: string;
  description: string | null;
  views: number;
  createdAt: string;
  imageCount: number;
  thumbnail: {
    id: number;
    fileUrl: string;
    originalName: string;
  } | null;
}

export interface GetGalleriesParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface GetGalleriesResponse {
  items: GalleryListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GalleryDetail {
  id: number;
  title: string;
  description: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  images: GalleryImageItem[];
}

export interface CreateGalleryPayload {
  title: string;
  description?: string;
  images: File[];
  thumbnailIndex?: number;
}

export interface UpdateGalleryPayload {
  id: number;
  title?: string;
  description?: string;
  images?: File[];
  deleteImageIds?: number[];
  thumbnailImageId?: number;
  thumbnailNewIndex?: number;
}