"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  addNoteAttachments,
  attachmentKey,
  formatFileSize,
  isPdfAttachment,
  MAX_NOTE_ATTACHMENTS,
  NOTE_ATTACHMENT_ACCEPT,
} from "@/lib/booking/attachments";

type NoteAttachmentsProps = {
  attachments: File[];
  onAttachmentsChange: (attachments: File[]) => void;
};

function AttachmentPreview({ file }: { file: File }) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--brand-cream)]">
      {isPdfAttachment(file) ? (
        <Image src="/images/rdv/icon-document.svg" alt="" width={24} height={24} />
      ) : (
        // A local blob URL, nothing for next/image to optimise. The ref owns the URL's lifetime so
        // it's revoked as soon as the thumbnail goes away.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="size-full object-cover"
          ref={(element) => {
            if (!element) return;
            const objectUrl = URL.createObjectURL(file);
            element.src = objectUrl;
            return () => URL.revokeObjectURL(objectUrl);
          }}
        />
      )}
    </span>
  );
}

/** Up to three images or PDFs joined to the note for the salon — see lib/booking/attachments. */
export function NoteAttachments({ attachments, onAttachmentsChange }: NoteAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const canAddMore = attachments.length < MAX_NOTE_ATTACHMENTS;

  const handlePick = (picked: FileList | null) => {
    if (!picked || picked.length === 0) return;
    const { files, errors: nextErrors } = addNoteAttachments(attachments, Array.from(picked));
    onAttachmentsChange(files);
    setErrors(nextErrors);
  };

  const handleRemove = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
    setErrors([]);
  };

  return (
    <div className="mt-3">
      {attachments.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {attachments.map((file, index) => (
            <li
              key={attachmentKey(file)}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-gray-100)] p-2 pr-3"
            >
              <AttachmentPreview file={file} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] text-[var(--color-gray-800)]" title={file.name}>
                  {file.name}
                </span>
                <span className="block text-[14px] text-[var(--color-gray-500)]">{formatFileSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Retirer ${file.name}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[22px] leading-none text-[var(--color-gray-500)] transition hover:bg-[var(--color-gray-100)] hover:text-[var(--color-gray-800)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {canAddMore && (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="w-fit border-[rgba(162,117,118,0.6)] px-5 py-2.5 text-[16px] text-[#8a5f60]"
          icon={
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          }
        >
          Joindre un fichier
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={NOTE_ATTACHMENT_ACCEPT}
        multiple
        hidden
        onChange={(event) => {
          handlePick(event.target.files);
          // Reset so picking the same file again after removing it still fires onChange.
          event.target.value = "";
        }}
      />

      {errors.length > 0 && (
        <ul role="alert" className="mt-2 flex flex-col gap-0.5 text-[14px] text-[var(--color-error)]">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
