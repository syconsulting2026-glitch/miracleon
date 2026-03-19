export interface NoticeAttachmentItem {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  fileType: "image" | "file";
  sortOrder: number;
  createdAt?: string;
}

export interface NoticeListItem {
  id: number;
  title: string;
  views: number;
  createdAt: string;
  attachmentCount: number;
  hasImage: boolean;
  hasAttachment: boolean;
}

export interface GetNoticesParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface GetNoticesResponse {
  items: NoticeListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  attachments: NoticeAttachmentItem[];
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  attachments?: File[];
}

export interface UpdateNoticePayload {
  id: number;
  title?: string;
  content?: string;
  attachments?: File[];
  deleteAttachmentIds?: number[];
}

export interface DeleteNoticePayload {
  id: number;
}

export interface DeleteManyNoticesPayload {
  ids: number[];
}

export interface NoticeAttachmentItem {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  fileType: "image" | "file";
  sortOrder: number;
  createdAt?: string;
}

export interface NoticeListItem {
  id: number;
  title: string;
  views: number;
  createdAt: string;
  attachmentCount: number;
  hasImage: boolean;
  hasAttachment: boolean;
}

export interface GetNoticesParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface GetNoticesResponse {
  items: NoticeListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  attachments: NoticeAttachmentItem[];
}