import AccountLinks from './AccountLinks';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="flex sticky top-0 left-0 justify-between items-center w-full bg-linear-to-r/srgb from-[#440773] to-[#0088a0] px-4 md:px-10 lg:px-25 py-3 sm:py-1.5 z-500">
      <Logo />
      <nav className="flex gap-5 justify-center">
        <AccountLinks />
      </nav>
    </header>
  );
};

export default Header;
