import React from 'react';
import CreatePostForm from './form';

const CreatePostPage = () => {
  return (
    <section className="relative flex flex-1 flex-col w-full items-center px-4 pt-2 bg-[url('/bg-hero.jpg')] bg-cover bg-center bg-no-repeat isolate">
      <div className="absolute flex flex-1 w-full z-50 bg-linear-to-r/srgb from-[#440773ba] to-[#0088a0ca] top-0 left-0 h-full" />
      <h1 className="text-2xl sm:text-3xl font-extralight py-10 z-100 text-secondary text-center px-3">
        Create New Post
      </h1>
      <CreatePostForm />
    </section>
  );
};

export default CreatePostPage;
