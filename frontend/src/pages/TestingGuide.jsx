const TestingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#0d141c] mb-4">Testing Guide</h1>
          <p className="text-[#49739c] text-lg">
            Welcome to Medscan AI Beta! Follow this guide to test our blood analysis system.
          </p>
        </div>

        {/* Beta Notice */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0d141c] mb-2">Beta Testing Phase</h3>
              <p className="text-[#49739c] leading-relaxed">
                Medscan AI is currently in beta testing. To ensure security and cost control, we require users to provide their own OpenAI API key. 
                This allows you to test the system while maintaining control over your API usage and costs.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] text-white rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0d141c] mb-4">Get Your OpenAI API Key</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-[#0d141c] mb-3">Step-by-step:</h4>
                    <ol className="space-y-2 text-[#49739c]">
                      <li>1. Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-[#248bf3] hover:underline">platform.openai.com</a></li>
                      <li>2. Sign up or log in to your account</li>
                      <li>3. Navigate to "API Keys" section</li>
                      <li>4. Click "Create new secret key"</li>
                      <li>5. Copy the generated key (starts with "sk-")</li>
                      <li>6. Ensure you have billing set up for API access</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-yellow-600 flex-shrink-0 mt-0.5">
                        <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/>
                      </svg>
                      <div>
                        <p className="font-medium text-yellow-800 text-sm">Cost Information</p>
                        <p className="text-yellow-700 text-sm">Analysis typically costs $0.01-0.05 per report using GPT-4o-mini model.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] text-white rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0d141c] mb-4">Create Your Account</h3>
                <p className="text-[#49739c] mb-4">
                  Register for a free Medscan AI account to access the testing platform.
                </p>
                <div className="flex gap-4">
                  <a
                    href="/register"
                    className="bg-gradient-to-r from-[#248bf3] to-[#0c7ff2] text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    Sign Up Now
                  </a>
                  <a
                    href="/login"
                    className="bg-gray-100 text-[#0d141c] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Already have an account?
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] text-white rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0d141c] mb-4">Configure Your API Key</h3>
                <p className="text-[#49739c] mb-4">
                  After logging in, you'll be prompted to enter your OpenAI API key. This is stored securely in your browser only.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-green-600 flex-shrink-0 mt-0.5">
                      <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-green-800 text-sm">Privacy Protected</p>
                      <p className="text-green-700 text-sm">Your API key is stored locally in your browser only. We never send it to our servers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] text-white rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0d141c] mb-4">Upload & Test</h3>
                <p className="text-[#49739c] mb-4">
                  Upload your blood test reports and experience our AI-powered analysis.
                </p>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-[#0d141c] mb-3">Supported formats:</h4>
                  <ul className="space-y-1 text-[#49739c]">
                    <li>• PDF files (most common)</li>
                    <li>• JPG/JPEG images</li>
                    <li>• PNG images</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-[#0d141c] mb-6">What You Can Test</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#0d141c] mb-2">AI Analysis</h4>
              <p className="text-[#49739c] text-sm">Advanced AI interpretation of your blood test results</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.28,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.28,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.28-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.72,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#0d141c] mb-2">Health Insights</h4>
              <p className="text-[#49739c] text-sm">Personalized recommendations based on your results</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.06-3.05L221.38,40.5a8,8,0,0,0-3.93-6,107.89,107.89,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L165.5,40.87q-2.16-.06-4.32,0L142.64,26.93a8,8,0,0,0-7.06-1.49A107.6,107.6,0,0,0,109.33,36.31a8,8,0,0,0-3.93,6L102.76,66a54.8,54.8,0,0,0-3.05,3.06L76,71.69a8,8,0,0,0-6,3.93A107.89,107.89,0,0,0,59.12,101.87a8,8,0,0,0,1.49,7.06L75.13,127.5q-.06,2.16,0,4.32L60.61,150.46a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3.06,3.05L34.62,215.5a8,8,0,0,0,3.93,6,107.89,107.89,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L90.5,215.13q2.16.06,4.32,0l18.64,13.94a8,8,0,0,0,7.06,1.49,107.6,107.6,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3.05-3.06L179.31,184a8,8,0,0,0,6-3.93,107.89,107.89,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-4.74,2.08,56.78,56.78,0,0,1-6.13,6.13,8,8,0,0,0-2.08,4.74l-2.5,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.49h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L109.89,215.12a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.08-4.74,56.78,56.78,0,0,1-6.13-6.13,8,8,0,0,0-4.74-2.08l-22.58-2.5a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.49-5,2.73,2.73,0,0,0,0-.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.88,109.89a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,4.74-2.08,56.78,56.78,0,0,1,6.13-6.13,8,8,0,0,0,2.08-4.74l2.5-22.58a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L146.11,40.88a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.08,4.74,56.78,56.78,0,0,1,6.13,6.13,8,8,0,0,0,4.74,2.08l22.58,2.5a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.9,123.66Z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#0d141c] mb-2">Dashboard</h4>
              <p className="text-[#49739c] text-sm">Track your health metrics and analysis history</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-[#0d141c] mb-4">Ready to Get Started?</h3>
          <p className="text-[#49739c] mb-6">
            Join our beta testing program and experience the future of blood test analysis.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/register"
              className="bg-gradient-to-r from-[#248bf3] to-[#0c7ff2] text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform text-lg"
            >
              Start Testing Now
            </a>
            <a
              href="/contact"
              className="bg-white text-[#0d141c] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg border border-gray-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingGuide; 