'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { VscSearchLarge } from 'react-icons/vsc';

import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';

const Hero = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim().length < 2) {
      toast.info('Search too short', {
        description: 'Please type at least 2 characters.',
      });
      return;
    }

    router.push(`/search?query=${input.trim()}`);
    setInput('');
  };

  return (
    <section className="relative flex w-full justify-center bg-[url('/bg-hero.jpg')] bg-cover bg-center bg-no-repeat h-70 z-100">
      <Toaster position="bottom-right" richColors />
      <div className="absolute flex w-full z-200 bg-linear-to-r/srgb from-[#440773ba] to-[#0088a0ca] top-0 left-0 h-70" />
      <div className="flex flex-col w-full text-4xl font-bold leading-2 justify-center items-center z-300 text-white  typeset typeset-docs">
        <h1 className="text-center text-secondary font-light mb-4">
          Read it. Learn it. Build together.
        </h1>
        <div>
          <Field>
            <ButtonGroup className="text-black mx-2">
              <Input
                id="input-button-group"
                className="h-10 text-base md:text-lg font-light text-secondary placeholder:text-secondary/40"
                placeholder="Type to search..."
                onChange={handleChange}
                value={input}
              />
              <Button
                variant="outline"
                className="h-10 text-base md:text-lg font-light"
                onClick={handleSubmit}
              >
                <VscSearchLarge />
                Search
              </Button>
            </ButtonGroup>
          </Field>
        </div>
      </div>
    </section>
  );
};

export default Hero;
