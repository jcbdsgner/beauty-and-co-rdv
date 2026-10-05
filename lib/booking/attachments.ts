/** Files a client can join to their note for the salon on the confirmation step (an inspiration
 *  photo, a prescription…). Kept in memory only: unlike the rest of the draft they aren't written
 *  to sessionStorage, so a full reload drops them. */
export const MAX_NOTE_ATTACHMENTS = 3;
export const MAX_NOTE_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/** File input `accept` — any image, plus PDF. HEIC is listed explicitly because some browsers
 *  don't map it to image/*. */
export const NOTE_ATTACHMENT_ACCEPT = "image/*,.heic,.heif,application/pdf";

export function isPdfAttachment(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

/** Identifies a picked file well enough to spot the same one picked twice. */
export function attachmentKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function isAllowedAttachment(file: File): boolean {
  return file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name) || isPdfAttachment(file);
}

/** Adds the picked files to the current ones, skipping (and explaining) whatever isn't an image or
 *  a PDF, is too heavy, or doesn't fit under the limit. */
export function addNoteAttachments(current: File[], picked: File[]): { files: File[]; errors: string[] } {
  const files = [...current];
  const errors: string[] = [];
  let overLimit = false;

  for (const file of picked) {
    if (files.some((existing) => attachmentKey(existing) === attachmentKey(file))) {
      // Already joined — picking it again is a slip, not a second copy to send.
      continue;
    } else if (!isAllowedAttachment(file)) {
      errors.push(`« ${file.name} » n'est pas une image ni un PDF.`);
    } else if (file.size > MAX_NOTE_ATTACHMENT_BYTES) {
      errors.push(`« ${file.name} » dépasse 10 Mo.`);
    } else if (files.length >= MAX_NOTE_ATTACHMENTS) {
      overLimit = true;
    } else {
      files.push(file);
    }
  }
  if (overLimit) errors.push(`${MAX_NOTE_ATTACHMENTS} fichiers maximum.`);

  return { files, errors };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}
