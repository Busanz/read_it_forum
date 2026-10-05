import SignUpForm from './form';

const SignUpPage = () => {
  return (
    <section className="relative flex flex-1 flex-col w-full items-center sm:justify-center px-4 pt-10 sm:pt-0 bg-[url('/bg-hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute flex flex-1 w-full z-200 bg-linear-to-r/srgb from-[#440773ba] to-[#0088a0ca] top-0 left-0 h-full" />
      <h1 className="text-2xl sm:text-3xl font-extralight pb-10 z-500 text-secondary">
        Create Your Account
      </h1>
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
