/**
 * Upload service — sends files as multipart/form-data to the backend.
 *
 * Backend expects: POST /upload
 *   Body: FormData { file: File }
 *   Response: { url: string }
 *
 * If using Express + Multer on the backend, add:
 *   app.post('/api/upload', upload.single('file'), (req, res) => res.json({ url: req.file.path }));
 */

import { api } from "../api-client";

export async function uploadImage(file: File): Promise<string> {
    console.log("[FRONT - Service UploadFile] Uploading file:", file.name, "| size:", file.size, "| type:", file.type);
    const formData = new FormData();
    formData.append("file", file);

    if(!formData) {
        throw new Error("FormData is not available.");
    }

    if(!formData.has("file") || formData === null) {
        throw new Error("FormData does not contain the file.");
    }
    console.log("[FRONT - Service UploadFile] FormData prepared:", formData.get("file"));
    // NOTE: Do NOT set Content-Type header — the browser sets it automatically
    // with the correct multipart boundary when using FormData.
    const data = await api(`/upload`, {
        method: "POST",
        body: formData,
    });

   console.log(
        "[FRONT - Service UploadFile] Upload response:",
        data,
    );

    if (!data?.url) {
        throw new Error(
            "Le serveur n'a pas retourné d'URL pour l'image uploadée.",
        );
    }

    return data.url;
}
