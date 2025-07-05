const Footer = () => {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] w-full flex-col text-center py-10 gap-6 px-5">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a className="text-[#49739c] text-base" href="#">Terms of Service</a>
          <a className="text-[#49739c] text-base" href="#">Privacy Policy</a>
          <a className="text-[#49739c] text-base" href="#">Contact Us</a>
        </div>
        <p className="text-[#49739c] text-base">@2024 Medscan AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
