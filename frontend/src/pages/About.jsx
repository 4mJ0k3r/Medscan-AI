const About = () => {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 py-10 max-w-[960px] mx-auto flex flex-col gap-16">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div
              className="aspect-video bg-cover bg-center rounded-lg w-full md:w-1/2"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYkcV9l1g9Aigafs2LCqHAaWLHlwTNC9xf7qXc31a99W1KF2qorhTIMkE5_e-RTDL3owcxbvCjOWqHtMf0zWgW3ZLvKnFRVToNK7YiIcITW3kcm_JUemHpfwdQ-8otMi9aTc4CMD1PlROQ5dh4-43pYCeTPNR3dNFjQyBHkaF00WaLgC3rz5s_zfveOfYif5BqrEeWJ3hIC1OPk_6SE1z_8ltEQ30bZb_X88bnv5cKpqRbx9-uTFZxoLmCoNCDj08Ccr9bpJ2XwdI')",
              }}
            ></div>
            <div className="flex flex-col gap-6 md:w-1/2">
              <h1 className="text-4xl font-black text-[#0d141c]">
                About Medscan AI
              </h1>
              <p className="text-base text-[#0d141c]">
                We're dedicated to making healthcare more accessible and understandable for everyone.
              </p>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight max-w-[720px]">
              Our Mission
            </h2>
            <p className="text-[#0d141c] text-base font-normal leading-normal max-w-[720px]">
                              At Medscan AI, we believe that everyone deserves to understand their health data. 
              Our AI-powered platform transforms complex blood test results into clear, actionable insights, 
              empowering you to make informed decisions about your health and wellness.
            </p>
          </div>
          
          {/* Our Values Section */}
          <div>
            <h2 className="text-[#0d141c] text-[22px] font-bold mb-6">
              Our Values
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
              <ValueBox
                title="Transparency"
                desc="We believe in clear, honest communication about your health data."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                  </svg>
                }
              />

              <ValueBox
                title="Innovation"
                desc="We continuously improve our AI technology to serve you better."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16.24,16.24,0,0,0-6.36-12.79A87.55,87.55,0,0,1,40,104a88,88,0,0,1,176,0Zm-16,0a72,72,0,0,0-144,0,71.64,71.64,0,0,0,27.71,56.59A32.15,32.15,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.29-25.41A71.64,71.64,0,0,0,200,104ZM128,48a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H136A8,8,0,0,1,128,48ZM58.34,69.66A8,8,0,0,1,69.66,58.34l11.31,11.31a8,8,0,0,1-11.31,11.31ZM48,128a8,8,0,0,1-8-8V104a8,8,0,0,1,16,0v16A8,8,0,0,1,48,128Zm9.66,58.34a8,8,0,0,1-11.31-11.31L57.66,163.72a8,8,0,1,1,11.31,11.31Zm137,11.31a8,8,0,0,1-11.31,11.31L171.72,197.66a8,8,0,0,1,11.31-11.31Zm20.34-69.65a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H224A8,8,0,0,1,216,128Zm-9.66-58.34a8,8,0,0,1-11.31-11.31L206.34,46.34a8,8,0,0,1,11.31,11.31Z" />
                  </svg>
                }
              />

              <ValueBox
                title="Privacy"
                desc="Your health data is protected with enterprise-grade security."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Our Story Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight max-w-[720px]">
              Our Story
            </h2>
            <p className="text-[#0d141c] text-base font-normal leading-normal max-w-[720px]">
                              Founded by a team of healthcare professionals and AI researchers, Medscan AI was born 
              from the frustration of waiting days or weeks to understand important health information. 
              We realized that modern AI could bridge the gap between complex medical data and patient 
              understanding, making healthcare more accessible and immediate.
            </p>
            <p className="text-[#0d141c] text-base font-normal leading-normal max-w-[720px]">
              Today, we're proud to serve thousands of users worldwide, helping them take control of 
              their health journey with confidence and clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueBox = ({ title, desc, icon }) => (
  <div className="flex flex-1 gap-3 rounded-lg border border-[#cedbe8] bg-slate-50 p-4 flex-col">
    <div className="text-[#0d141c]">{icon}</div>
    <div className="flex flex-col gap-1">
      <h2 className="text-[#0d141c] text-base font-bold leading-tight">
        {title}
      </h2>
      <p className="text-[#49739c] text-sm font-normal leading-normal">
        {desc}
      </p>
    </div>
  </div>
);

export default About; 