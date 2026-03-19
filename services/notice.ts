import { api } from "@/lib/api";
import {
  CreateNoticePayload,
  DeleteManyNoticesPayload,
  DeleteNoticePayload,
  GetNoticesParams,
  GetNoticesResponse,
  NoticeDetail,
  UpdateNoticePayload,
} from "@/types/notice";

export const getNotices = async (
  params: GetNoticesParams = {}
): Promise<GetNoticesResponse> => {
  const { data } = await api.get<GetNoticesResponse>("/notices", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      q: params.q ?? "",
    },
  });

  return data;
};

export const getNoticeDetail = async (id: number): Promise<NoticeDetail> => {
  const { data } = await api.get<NoticeDetail>(`/notices/${id}`);
  return data;
};

export const createNotice = async (
  payload: CreateNoticePayload
): Promise<NoticeDetail> => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("content", payload.content);

  (payload.attachments ?? []).forEach((file) => {
    formData.append("attachments", file);
  });

  const { data } = await api.post<NoticeDetail>("/notices", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateNotice = async (
  payload: UpdateNoticePayload
): Promise<NoticeDetail> => {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }

  if (payload.content !== undefined) {
    formData.append("content", payload.content);
  }

  if (payload.deleteAttachmentIds && payload.deleteAttachmentIds.length > 0) {
    formData.append(
      "deleteAttachmentIds",
      JSON.stringify(payload.deleteAttachmentIds)
    );
  }

  (payload.attachments ?? []).forEach((file) => {
    formData.append("attachments", file);
  });

  const { data } = await api.put<NoticeDetail>(
    `/notices/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteNotice = async ({
  id,
}: DeleteNoticePayload): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>(`/notices/${id}`);
  return data;
};

export const deleteManyNotices = async ({
  ids,
}: DeleteManyNoticesPayload): Promise<void> => {
  await Promise.all(ids.map((id) => api.delete(`/notices/${id}`)));
};