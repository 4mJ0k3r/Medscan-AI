import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { title: "AI-Powered Analysis", desc: "Advanced machine learning algorithms analyze your blood test results" },
    { title: "Instant Results", desc: "Get comprehensive insights within minutes, not days" },
    { title: "Personalized Recommendations", desc: "Receive tailored health advice based on your unique profile" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-white group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-6 py-12 max-w-[1200px] mx-auto flex flex-col gap-20">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#248bf3] via-[#0c7ff2] to-[#0066cc] p-12 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex flex-col gap-8 lg:w-1/2">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    Beta Testing Phase - Bring Your Own API Key
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                    Decode Your
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Blood Tests
                    </span>
                    Instantly
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Transform complex medical reports into clear, actionable health insights with our AI-powered analysis platform.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/upload" 
                    className="group relative overflow-hidden bg-white text-[#248bf3] font-bold rounded-xl px-8 py-4 text-lg flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="mr-3">
                      <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/>
                    </svg>
                    Start Analysis
                  </Link>
                  <Link 
                    to="/about" 
                    className="bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl px-8 py-4 text-lg flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Learn More
                  </Link>
                </div>
                
                <div className="flex items-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.28,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.28,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.28-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.72,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                    </svg>
                    Secure & Private
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                    </svg>
                    Results in Minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40A8,8,0,0,0,32,40v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68A16,16,0,0,0,243.31,136Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"/>
                    </svg>
                    AI-Powered
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                          <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{features[currentFeature].title}</h3>
                        <p className="text-white/80 text-sm">{features[currentFeature].desc}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        <span>Analysis Progress</span>
                        <span>95%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-[95%] transition-all duration-1000"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-white font-bold text-xl">99.2%</div>
                        <div className="text-white/70 text-xs">Accuracy</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-white font-bold text-xl">&lt;3min</div>
                        <div className="text-white/70 text-xs">Processing</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-white font-bold text-xl">24/7</div>
                        <div className="text-white/70 text-xs">Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* Features Section */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#0d141c]">
                Why Choose Medscan AI?
              </h2>
              <p className="text-xl text-[#49739c] max-w-3xl mx-auto">
                Experience the future of healthcare with our cutting-edge AI platform that transforms complex medical data into actionable insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Lightning Fast Analysis"
                desc="Get comprehensive blood test analysis in under 3 minutes. Our advanced AI processes your results instantly, eliminating the wait time for medical interpretation."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                  </svg>
                }
                color="from-blue-500 to-blue-600"
              />

              <FeatureCard
                title="Personalized Insights"
                desc="Receive tailored health recommendations based on your unique profile, medical history, and current results. Every insight is customized for you."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/>
                  </svg>
                }
                color="from-green-500 to-green-600"
              />

              <FeatureCard
                title="Bank-Level Security"
                desc="Your health data is protected with end-to-end encryption and HIPAA-compliant security measures. Your privacy is our top priority."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/>
                  </svg>
                }
                color="from-purple-500 to-purple-600"
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-3xl border border-[#cedbe8] p-12">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-[#0d141c]">
                  How It Works
                </h2>
                <p className="text-xl text-[#49739c] max-w-2xl mx-auto">
                  Get started in three simple steps and unlock the power of AI-driven health insights.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard
                  step="1"
                  title="Upload Your Report"
                  desc="Simply upload your blood test PDF or image. Our AI supports all major lab formats and can read handwritten reports."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"/>
                    </svg>
                  }
                />
                
                <StepCard
                  step="2"
                  title="AI Analysis"
                  desc="Our advanced machine learning algorithms analyze your results, comparing them with medical databases and your health profile."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                    </svg>
                  }
                />
                
                <StepCard
                  step="3"
                  title="Get Insights"
                  desc="Receive detailed analysis, personalized recommendations, and actionable next steps to optimize your health journey."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16.24,16.24,0,0,0-6.36-12.79A87.55,87.55,0,0,1,40,104a88,88,0,0,1,176,0Zm-16,0a72,72,0,0,0-144,0,71.64,71.64,0,0,0,27.71,56.59A32.15,32.15,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.29-25.41A71.64,71.64,0,0,0,200,104Z"/>
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-[#0d141c]">
                Ready to Understand Your Health?
              </h2>
              <p className="text-xl text-[#49739c] max-w-2xl mx-auto">
                Join thousands of users who have already discovered the power of AI-driven health insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/upload" 
                className="group relative overflow-hidden bg-gradient-to-r from-[#248bf3] to-[#0c7ff2] text-white font-bold rounded-xl px-8 py-4 text-lg flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="mr-3">
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/>
                </svg>
                Start Your Analysis
              </Link>
              <Link 
                to="/testing-guide" 
                className="bg-white text-[#248bf3] border-2 border-[#248bf3] font-semibold rounded-xl px-8 py-4 text-lg flex items-center justify-center hover:bg-[#248bf3] hover:text-white transition-colors"
              >
                Testing Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, color }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white border border-[#cedbe8] p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"></div>
    <div className="relative z-10 space-y-6">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-[#0d141c] text-xl font-bold group-hover:text-[#248bf3] transition-colors">
          {title}
        </h3>
        <p className="text-[#49739c] text-base leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </div>
);

const StepCard = ({ step, title, desc, icon }) => (
  <div className="relative text-center space-y-6">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] rounded-2xl flex items-center justify-center text-white shadow-xl">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {step}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-[#0d141c] text-xl font-bold">
          {title}
        </h3>
        <p className="text-[#49739c] text-base leading-relaxed max-w-sm mx-auto">
          {desc}
        </p>
      </div>
    </div>
    
    {/* Connector line */}
    {step !== "3" && (
      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#248bf3] to-transparent transform translate-x-4 -translate-y-1/2"></div>
    )}
  </div>
);

export default Landing;
