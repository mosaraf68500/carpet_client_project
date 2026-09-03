// Uploads images straight from the browser to Cloudinary using an unsigned
// upload preset, bypassing the backend entirely — needed because a Vercel
// Hobby serverless function has a hard 10s timeout, and routing an upload
// (plus its retries) through the backend could take far longer than that.
// The backend never sees the raw file, only the resulting {url, publicId}
// once this succeeds.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

function uploadOne(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) {
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error(data?.error?.message || `Image upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading image"));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    xhr.send(formData);
  });
}

// Uploads every file in `files` in parallel and reports one combined 0-100
// progress across all of them (equally weighted) — forms show a single
// progress bar regardless of how many images are being uploaded at once.
// Resolves to [{url, publicId}, ...] in the same order as `files`.
export async function uploadImagesToCloudinary(files, onProgress) {
  if (!files || files.length === 0) return [];

  const progressByIndex = new Array(files.length).fill(0);
  const reportProgress = () => {
    if (!onProgress) return;
    const total = progressByIndex.reduce((sum, pct) => sum + pct, 0);
    onProgress(Math.round(total / files.length));
  };

  return Promise.all(
    files.map((file, i) =>
      uploadOne(file, (pct) => {
        progressByIndex[i] = pct;
        reportProgress();
      })
    )
  );
}
