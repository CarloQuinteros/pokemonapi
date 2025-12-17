function Header() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center sm:justify-start gap-4">
        <img
          src="/pokemon-logo.png"
          alt="Pokemon Logo"
          className="h-10 object-contain"
        />
      </div>
    </header>
  );
}

export default Header;
