import { useRef, useState } from "react";
import { bloodTestAPI } from "../../services/api";

const UploadBox = ({ onUploadSuccess, onUploadError, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current.click(); // open file dialog
  };

  const handleFileChange = async (e) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.('Please select a valid file (PDF, JPG, PNG)');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      onUploadError?.('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('bloodTestFile', file);

      const response = await bloodTestAPI.uploadReport(formData);
      
      if (response.data.success) {
        setUploadProgress(100);
        onUploadSuccess?.(response.data.data);
      } else {
        onUploadError?.(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Upload failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors?.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div className={`flex flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-14 ${
        disabled ? 'border-gray-300 bg-gray-50' : 'border-[#cedbe8]'
      }`}>
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className={`text-lg font-bold text-center ${
            disabled ? 'text-gray-400' : 'text-[#0d141c]'
          }`}>
            {disabled ? 'API Key Required' : 'Drag and drop your blood test report here'}
          </p>
          <p className={`text-sm font-normal text-center ${
            disabled ? 'text-gray-400' : 'text-[#0d141c]'
          }`}>
            {disabled 
              ? 'Please configure your OpenAI API key to upload and analyze reports'
              : 'Supported formats: PDF, JPG, PNG. Maximum file size: 10MB'
            }
          </p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf, .jpg, .jpeg, .png"
          className="hidden"
          disabled={disabled}
        />

        {/* Styled button */}
        <button
          onClick={handleButtonClick}
          disabled={isUploading || disabled}
          className={`flex min-w-[120px] max-w-[480px] h-10 px-5 items-center justify-center rounded-lg text-white text-sm font-bold tracking-[0.015em] transition duration-200 shadow-sm ${
            isUploading || disabled
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#248bf3] hover:bg-[#0c7ff2]'
          }`}
        >
          <span className="truncate">
            {disabled ? 'Configure API Key' : (isUploading ? 'Uploading...' : 'Browse Files')}
          </span>
        </button>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="w-full max-w-[480px] bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#248bf3] h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBox;
