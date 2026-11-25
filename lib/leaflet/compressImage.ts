/** 프로토타입용: localStorage 할당량을 넘기지 않도록 사진을 줄인다. 서버 업로드 없음. */

const MAX_EDGE = 900;
const JPEG_QUALITY = 0.72;

/**
 * File → 짧은 변 기준이 아닌 긴 변 maxEdge JPEG data URL.
 * 실패하면 원본 FileReader 결과를 쓰지 말고 null.
 */
export function compressImageFile(
  file: File,
  options?: { maxEdge?: number; quality?: number },
): Promise<string> {
  const maxEdge = options?.maxEdge ?? MAX_EDGE;
  const quality = options?.quality ?? JPEG_QUALITY;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        reject(new Error("empty"));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("image decode"));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** 이미 data URL이면 다시 줄인다(저장 직전 폴백). */
export function recompressDataUrl(
  dataUrl: string,
  options?: { maxEdge?: number; quality?: number },
): Promise<string> {
  const maxEdge = options?.maxEdge ?? 720;
  const quality = options?.quality ?? 0.6;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("image decode"));
    img.src = dataUrl;
  });
}
