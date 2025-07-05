const UploadTabs = () => {
  return (
    <div className="pb-3">
      <div className="flex border-b border-[#cedbe8] gap-8">
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-b-[#248bf3] text-[#0d141c] pb-[13px] pt-4"
          href="#"
        >
          <p className="text-sm font-bold leading-normal tracking-[0.015em]">
            Upload
          </p>
        </a>
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#49739c] pb-[13px] pt-4"
          href="#"
        >
          <p className="text-sm font-bold leading-normal tracking-[0.015em]">
            Process
          </p>
        </a>
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#49739c] pb-[13px] pt-4"
          href="#"
        >
          <p className="text-sm font-bold leading-normal tracking-[0.015em]">
            Review
          </p>
        </a>
      </div>
    </div>
  );
};

export default UploadTabs;
