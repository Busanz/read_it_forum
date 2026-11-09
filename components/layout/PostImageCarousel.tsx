'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type PostImageCarouselProps = {
  images: string[];
  title: string;
  isSlugPage?: boolean;
};

export const PostImageCarousel = ({
  images,
  title,
  isSlugPage,
}: PostImageCarouselProps) => {
  if (images.length === 0) return null;

  return (
    <Carousel
      className={`w-full ${isSlugPage ? 'max-w-xl' : 'max-w-lg'}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={src}>
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={src}
                alt={`${title} image ${index + 1}`}
                fill
                loading="eager"
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
};
