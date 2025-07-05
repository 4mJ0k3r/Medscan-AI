const Services = () => {
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
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkGwRsSXGxleC9BCXjKNLd7v-d-QTLTCT-SkSkP-TlQVMvlqZM7iaPdhUJex7OChrtAHy1CIgH6uF9LXjDQq7vgD8Q3HDQwqimEBWNmAf5Mo1CEDEJ6zsu64xYMvVLr9ukaIXhmUCT5Khfkrp_9fVKEpSLKrlNV_L_JZPUo7TPBhLBf0Dr6yFPJgIqeuUtoIxXBSnyI8efm6P7XmFBvPDqUs3Q9SbBdigfq7rKFTVx15qHudTw3CgqzOxDhMxWVbghpBB6XS0Lyu4')",
              }}
            ></div>
            <div className="flex flex-col gap-6 md:w-1/2">
              <h1 className="text-4xl font-black text-[#0d141c]">
                Our Services
              </h1>
              <p className="text-base text-[#0d141c]">
                Comprehensive AI-powered health analysis tools designed for your peace of mind.
              </p>
            </div>
          </div>

          {/* Main Services Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight max-w-[720px]">
              What We Offer
            </h2>
            <p className="text-[#0d141c] text-base font-normal leading-normal max-w-[720px]">
              Our platform provides a comprehensive suite of tools to help you understand and 
              manage your health data effectively.
            </p>
          </div>
          
          {/* Services Grid */}
          <div>
            <h2 className="text-[#0d141c] text-[22px] font-bold mb-6">
              Core Services
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 p-0">
              <ServiceCard
                title="Blood Test Analysis"
                desc="Upload your blood test results and get instant AI-powered insights with detailed explanations of every parameter."
                features={["Instant analysis", "Detailed explanations", "Reference ranges", "Trend tracking"]}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    height="32px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
                  </svg>
                }
              />

              <ServiceCard
                title="Personalized Recommendations"
                desc="Get tailored health recommendations based on your unique blood test results and health profile."
                features={["Custom advice", "Lifestyle suggestions", "Dietary recommendations", "Exercise guidance"]}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    height="32px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                  </svg>
                }
              />

              <ServiceCard
                title="Secure Data Storage"
                desc="Your health data is encrypted and stored securely with enterprise-grade security measures."
                features={["End-to-end encryption", "HIPAA compliant", "Data ownership", "Privacy controls"]}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    height="32px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight max-w-[720px]">
              How It Works
            </h2>
            <div className="flex flex-col gap-6">
              <ProcessStep
                step="1"
                title="Upload Your Results"
                desc="Simply upload your blood test results in any common format (PDF, image, or text)."
              />
              <ProcessStep
                step="2"
                title="AI Analysis"
                desc="Our advanced AI analyzes your results and compares them against medical standards."
              />
              <ProcessStep
                step="3"
                title="Get Insights"
                desc="Receive clear, actionable insights and personalized recommendations in minutes."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, desc, features, icon }) => (
  <div className="flex flex-col gap-4 rounded-lg border border-[#cedbe8] bg-white p-6">
    <div className="flex items-center gap-3">
      <div className="text-[#248bf3]">{icon}</div>
      <h3 className="text-[#0d141c] text-xl font-bold">{title}</h3>
    </div>
    <p className="text-[#49739c] text-sm font-normal leading-normal">{desc}</p>
    <ul className="flex flex-col gap-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-[#0d141c] text-sm">
          <div className="w-2 h-2 bg-[#248bf3] rounded-full"></div>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const ProcessStep = ({ step, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#248bf3] text-white font-bold text-lg">
      {step}
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-[#0d141c] text-lg font-bold">{title}</h3>
      <p className="text-[#49739c] text-base">{desc}</p>
    </div>
  </div>
);

export default Services; 