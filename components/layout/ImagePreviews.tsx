'use client';

import Image from 'next/image';
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';

import { Button } from '../ui/button';
import { RxCross2 } from 'react-icons/rx';

type ImagePreviewsProps = {
  files: File[];
  onRemove: (index: number) => void;
};

type PreviewEntry = { file: File; url: string };
const previewCache: PreviewEntry[] = [];

const getPreviewUrl = (file: File) => {
  const existing = previewCache.find((entry) => entry.file === file);
  if (existing) return existing.url;

  const url = URL.createObjectURL(file);
  previewCache.push({ file, url });
  return url;
};

const releasePreviewUrl = (file: File) => {
  const index = previewCache.findIndex((entry) => entry.file === file);
  if (index === -1) return;

  URL.revokeObjectURL(previewCache[index].url);
  previewCache.splice(index, 1);
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const ImagePreviews = ({ files, onRemove }: ImagePreviewsProps) => {
  if (files.length === 0) return null;

  const handleRemove = (index: number) => {
    releasePreviewUrl(files[index]);
    onRemove(index);
  };

  return (
    <AttachmentGroup>
      {files.map((file, index) => (
        <Attachment
          key={`${file.name}-${file.lastModified}-${index}`}
          orientation="vertical"
          className="relative"
        >
          <AttachmentMedia variant="image">
            <Image
              src={getPreviewUrl(file)}
              alt={file.name}
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>
              {formatSize(file.size)}
            </AttachmentDescription>
          </AttachmentContent>

          <Button
            type="button"
            onClick={() => handleRemove(index)}
            aria-label={`Remove button ${file.name}`}
            className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
          >
            <RxCross2 />
          </Button>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
};

export default ImagePreviews;
