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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    // NOTE: Do NOT set Content-Type header — the browser sets it automatically
    // with the correct multipart boundary when using FormData.
    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? `Upload failed (${res.status})`);
    }

    const data = await res.json();

    if (!data?.url) {
        throw new Error("Le serveur n'a pas retourné d'URL pour l'image uploadée.");
    }

    return data.url as string;
}
