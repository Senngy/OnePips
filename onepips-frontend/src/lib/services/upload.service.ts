/**
 * Upload service — sends files as multipart/form-data to the backend.
 *
 * Backend expects: POST /upload
 *   Body: FormData { file: File }
 *   Response: { url: string }
 */

import { api } from "../api-client";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await api<{ url: string }>("/upload", {
    method: "POST",
    body: formData,
  });

  return data.url;
}
