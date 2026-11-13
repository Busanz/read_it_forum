'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { VscSearchLarge } from 'react-icons/vsc';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { POST_CATEGORIES } from '@/app/(post)/create/post-categories';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORY_ITEMS = [
  { label: 'All categories', value: 'all' },
  ...POST_CATEGORIES,
];

const Hero = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = input.trim();

    if (!searchTerm && !category) {
      toast.info('Nothing to search', {
        description: 'Type something or select a category.',
      });
      return;
    }
    if (searchTerm && searchTerm.length < 3) {
      toast.info('Search too short', {
        description: 'Please type at least 3 characters.',
      });
      return;
    }
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set('query', searchTerm);
    }
    if (category) {
      params.set('category', category);
    }

    router.push(`/search?${params.toString()}`);
    setInput('');
    setCategory('');
  };

  return (
    <section className="relative flex w-full justify-center bg-[url('/bg-hero.jpg')] bg-cover bg-center bg-no-repeat h-70 z-100">
      <Toaster position="bottom-right" richColors />
      <div className="absolute flex w-full z-200 bg-linear-to-r/srgb from-[#440773ba] to-[#0088a0ca] top-0 left-0 h-70" />
      <div className="flex flex-col w-fulltext-4xl font-bold leading-2 justify-center items-center z-300 text-white  typeset typeset-docs">
        <h1 className="text-center text-secondary font-light mb-4">
          Read it. Learn it. Build together.
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl z-600 px-3">
          <Field className="flex">
            <ButtonGroup className="text-black">
              <Input
                id="input-button-group"
                className="h-7.5 sm:h-10 text-base md:text-lg font-light text-secondary placeholder:text-secondary/40"
                placeholder="Type to search..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </ButtonGroup>
            <div className="flex w-full justify-between gap-3 z-600">
              <Select
                items={CATEGORY_ITEMS}
                value={category || 'all'}
                onValueChange={(value) =>
                  setCategory(!value || value === 'all' ? '' : value)
                }
              >
                <SelectTrigger
                  id="post_category"
                  className="flex w-full px-4 sm:px-5 py-1 sm:py-5 h-7.5 sm:h-10 text-base md:text-lg text-background mb-3 font-light"
                >
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORY_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="submit"
                variant="outline"
                className="px-4 sm:px-5 py-1 sm:py-5 sm:h-10 max-w-50 text-base md:text-lg font-light text-black rounded-full"
              >
                <VscSearchLarge />
                Search
              </Button>
            </div>
          </Field>
        </form>
      </div>
    </section>
  );
};

export default Hero;
