import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadTabs from "../components/uploader/UploadTabs";
import UploadBox from "../components/uploader/UploadBox";
import ApiKeyManager from "../components/ApiKeyManager";

const UploadPage = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API key exists on component mount
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setShowApiKeyModal(true);
    } else {
      setHasApiKey(true);
    }
  }, []);

  const handleApiKeySet = (apiKey) => {
    setHasApiKey(!!apiKey);
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  };

  const handleUploadSuccess = (reportData) => {
    setNotification({
      type: 'success',
      message: 'File uploaded successfully! Processing your blood test report...'
    });
    
    // Navigate to report details after a short delay
    setTimeout(() => {
      navigate(`/report/${reportData.reportId}`);
    }, 2000);
  };

  const handleUploadError = (error) => {
    setNotification({
      type: 'error',
      message: error
    });
    
    // Clear error after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="w-full max-w-[960px] flex flex-col">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3">
          <p className="text-[#0d141c] text-[32px] font-bold leading-tight min-w-72">
            Blood Test Analysis
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 rounded-xl ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="p-6">
              <div className="flex items-start gap-3">
                {notification.type === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-green-600 flex-shrink-0 mt-0.5">
                    <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.28,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.28,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.28-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.72,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-red-600 flex-shrink-0 mt-0.5">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/>
                  </svg>
                )}
                <div className="flex-1">
                  <p className={`font-medium mb-2 ${
                    notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {notification.type === 'success' ? 'Upload Successful!' : 'Upload Failed'}
                  </p>
                  <p className={`text-sm ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.type === 'error' && (notification.message.includes('PDF parsing failed') || notification.message.includes('contains images rather than extractable text')) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-blue-800 font-medium text-sm mb-2">
                        {notification.message.includes('contains images') ? '📄➡️🖼️ Convert to Image:' : '💡 Try these solutions:'}
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        {notification.message.includes('contains images') ? (
                          <>
                            <li>• <strong>Windows:</strong> PDF → Print → Save as JPG</li>
                            <li>• <strong>Mac:</strong> PDF → Export As → JPG</li>
                            <li>• <strong>Online:</strong> Use PDF to JPG converter</li>
                          </>
                        ) : (
                          <>
                            <li>• Convert your PDF to JPG/PNG format</li>
                            <li>• Take a clear photo of the printed report</li>
                            <li>• Ensure the PDF is not password-protected</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <UploadTabs />

        {/* API Key Status */}
        {hasApiKey && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 256 256">
                    <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.28,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.28,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.28-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.72,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800 text-sm">API Key Configured</p>
                  <p className="text-green-700 text-xs">Ready to analyze your blood test reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Manage
              </button>
            </div>
          </div>
        )}

        {/* Upload Box */}
        <UploadBox 
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          disabled={!hasApiKey}
        />

        {/* Terms Notice */}
        <p className="text-[#49739c] text-sm font-normal leading-normal text-center underline pt-4">
          By uploading, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* API Key Manager Modal */}
      <ApiKeyManager
        showModal={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySet={handleApiKeySet}
      />
    </div>
  );
};

export default UploadPage;

