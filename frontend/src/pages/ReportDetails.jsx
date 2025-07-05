import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { bloodTestAPI } from '../services/api';
import { generateReportPDF, downloadReportData } from '../utils/pdfUtils';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch report details first
        const reportResponse = await bloodTestAPI.getReport(id);
        
        if (reportResponse.data.success) {
          setReport(reportResponse.data.data);
        }
        
        // Try to fetch analysis
        try {
          const analysisResponse = await bloodTestAPI.getAnalysis(id);
          
          if (analysisResponse.data.success) {
            const data = analysisResponse.data.data;
            
            // Check if we have actual analysis data
            if (data.analysis) {
              setAnalysis(data);
            } else if (data.status === 'processing') {
              // Handle processing status
              setAnalysis({
                status: 'processing',
                message: data.message || 'Analysis in progress...'
              });
              
              // Start polling for completion
              if (!isPolling) {
                setIsPolling(true);
                pollForAnalysisCompletion();
              }
            }
          }
        } catch (analysisError) {
          // If analysis returns 400, it means it's not ready yet
          if (analysisError.response?.status === 400) {
            // Check report status to determine if we should poll
            if (reportResponse.data.data?.status === 'processing' || reportResponse.data.data?.status === 'uploaded') {
              setAnalysis({
                status: 'processing',
                message: 'Analysis in progress...'
              });
              
              // Start polling for completion
              if (!isPolling) {
                setIsPolling(true);
                pollForAnalysisCompletion();
              }
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportData();
    }
  }, [id]);

  useEffect(() => {
    // Start polling if report exists but analysis is not complete
    if (report && !analysis && !isPolling) {
      if (report.status === 'processing' || report.status === 'uploaded') {
        setIsPolling(true);
        pollForAnalysisCompletion();
      }
    }
  }, [report, analysis, isPolling]);

  const pollForAnalysisCompletion = async () => {
    const maxAttempts = 30; // 30 attempts = 5 minutes
    let attempts = 0;
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setIsPolling(false);
        setError('Analysis is taking longer than expected. Please try refreshing the page.');
        return;
      }
      
      try {
        const response = await bloodTestAPI.getAnalysis(id);
        
        if (response.data.success && response.data.data) {
          const analysisData = response.data.data;
          
          // Check if analysis is complete
          if (analysisData.analysis && (analysisData.analysis.healthScore || analysisData.analysis.overallScore)) {
            setAnalysis(analysisData);
            setIsPolling(false);
            
            // Update the report status if needed
            const reportResponse = await bloodTestAPI.getReport(id);
            if (reportResponse.data.success) {
              setReport(reportResponse.data.data);
            }
            
            return;
          }
          
          // If analysis exists but is still processing, continue polling
          if (analysisData.status === 'processing') {
            // Continue polling
          }
        }
      } catch (error) {
        // If we get a 400 error, it means analysis is not ready yet
        // Continue polling unless we've hit the max attempts
        if (error.response?.status === 400) {
          // Continue polling
        }
      }
      
      attempts++;
      setTimeout(poll, 5000); // Poll every 5 seconds for faster response
    };
    
    poll();
  };

  const handleDownloadPDF = () => {
    if (report && analysis) {
      generateReportPDF(report, analysis);
    }
  };

  const handleDownloadData = () => {
    if (report && analysis) {
      downloadReportData(report, analysis);
    }
  };

  const handleShareWithDoctor = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Blood Test Report',
        text: `Blood test analysis report from ${new Date(report.createdAt).toLocaleDateString()}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Report link copied to clipboard!');
      }).catch(() => {
        alert('Unable to copy link. Please copy the URL manually.');
      });
    }
  };

  const handleScheduleFollowUp = () => {
    // Open email client with pre-filled content
    const subject = encodeURIComponent('Blood Test Follow-up Appointment Request');
    const body = encodeURIComponent(`Hello,

I would like to schedule a follow-up appointment to discuss my recent blood test results.

Report Date: ${new Date(report.createdAt).toLocaleDateString()}
Health Score: ${analysis.analysis?.healthScore || analysis.analysis?.overallScore || 'N/A'}/100

Please let me know your available times.

Thank you!`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#248bf3]"></div>
          <p className="mt-4 text-[#49739c]">Loading report analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-red-600 flex-shrink-0 mt-1">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/>
              </svg>
              <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg mb-3">Unable to Process Report</h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                
                {(error.includes('PDF parsing failed') || error.includes('contains images rather than extractable text')) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <h4 className="text-blue-800 font-semibold text-sm mb-3">
                      {error.includes('contains images') ? '📄➡️🖼️ Convert PDF to Image:' : '💡 Suggested Solutions:'}
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-2">
                      {error.includes('contains images') ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong>Windows:</strong> Open PDF → Print → Save as JPG/PNG</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong>Mac:</strong> Open PDF → File → Export As → JPG/PNG</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong>Online:</strong> Use PDF to JPG converter (smallpdf.com, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong>Mobile:</strong> Take a clear photo of the printed report</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Try converting your PDF to a JPG or PNG image</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Take a clear photo of the printed report</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Ensure the PDF is not password-protected</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Request a new copy from your lab if the file is corrupted</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
                
                {error.includes('Insufficient text') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <h4 className="text-blue-800 font-semibold text-sm mb-3">💡 Suggested Solutions:</h4>
                    <ul className="text-blue-700 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Ensure the document contains readable text</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Try uploading a higher quality image</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Make sure the report is not blank or corrupted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Check that you uploaded a blood test report</span>
                      </li>
                    </ul>
                  </div>
                )}

                {error.includes('API key') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                    <h4 className="text-yellow-800 font-semibold text-sm mb-3">🔑 API Key Required:</h4>
                    <ul className="text-yellow-700 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>Please configure your OpenAI API key in the header</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>Visit our Testing Guide for setup instructions</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-[#248bf3] text-white rounded-xl hover:bg-[#0c7ff2] transition-colors font-medium"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-gray-100 text-[#0d141c] rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Try Another Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-[#49739c] mb-4">Report not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#248bf3] text-white rounded-lg hover:bg-[#0c7ff2] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show analysis loading or processing state
  if (!analysis && report && (report.status === 'processing' || report.status === 'uploaded')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#248bf3]"></div>
          <p className="mt-4 text-[#49739c] text-lg font-medium">Processing your blood test...</p>
          <p className="mt-2 text-[#49739c] text-sm">This may take a few minutes. Please don't refresh the page.</p>
          {isPolling && (
            <p className="mt-2 text-[#248bf3] text-sm">🔄 Checking for results...</p>
          )}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-[#49739c] mb-4">Analysis not available</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#248bf3] text-white rounded-lg hover:bg-[#0c7ff2] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-6 py-8 max-w-[1200px] mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#248bf3] via-[#0c7ff2] to-[#0066cc] p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                      <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/>
                    </svg>
                  </div>
                  <h1 className="text-4xl font-black text-white">
                    Blood Test Report
                  </h1>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
                    </svg>
                    Uploaded on {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                      </svg>
                      Status: {report.status}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/>
                      </svg>
                      {report.originalFileName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-2xl border border-[#cedbe8] p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#248bf3] rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                    </svg>
                  </div>
                  <h2 className="text-[#0d141c] text-3xl font-bold">
                    Overall Health Score
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 flex-1">
                      <div
                        className="bg-gradient-to-r from-[#248bf3] to-[#0c7ff2] h-4 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${analysis.analysis?.healthScore || analysis.analysis?.overallScore || analysis.healthScore || analysis.overallScore || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      {analysis.status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#248bf3]"></div>
                          <span className="text-[#49739c] text-sm">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <div className="text-5xl font-bold text-[#248bf3]">
                            {analysis.analysis?.healthScore || analysis.analysis?.overallScore || analysis.healthScore || analysis.overallScore || 'N/A'}
                          </div>
                          <div className="text-[#49739c] text-lg">/100</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-[#f0f9ff] rounded-xl p-4 border border-[#bae6fd]">
                    <p className="text-[#0d141c] text-base leading-relaxed">
                      {analysis.status === 'processing' 
                        ? analysis.message || 'Your blood test is being analyzed. This may take a few minutes...'
                        : analysis.analysis?.summary || analysis.summary || 'Analysis summary will appear here once processing is complete.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Score interpretation */}
              {!analysis.status || analysis.status !== 'processing' ? (
                <div className="bg-white rounded-xl p-6 border border-[#cedbe8] min-w-[280px]">
                  <h3 className="text-[#0d141c] text-lg font-bold mb-4">Score Interpretation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-[#0d141c]">80-100: Excellent</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-[#0d141c]">60-79: Good</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-[#0d141c]">40-59: Fair</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-[#0d141c]">Below 40: Needs Attention</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white rounded-lg border border-[#cedbe8] p-6">
            <h2 className="text-[#0d141c] text-2xl font-bold mb-6">
              Key Findings
            </h2>
            <div className="space-y-4">
              {(analysis.analysis?.keyFindings || analysis.keyFindings) && (analysis.analysis?.keyFindings || analysis.keyFindings).length > 0 ? (
                (analysis.analysis?.keyFindings || analysis.keyFindings).map((finding, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-[#cedbe8] bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[#0d141c] text-lg font-bold">
                          {finding.parameter || finding.name}
                        </h3>
                        {finding.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(finding.status)}`}>
                            {finding.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        {finding.value && (
                          <span className="text-[#0d141c] font-medium">
                            Your Value: {finding.value}
                          </span>
                        )}
                        {finding.referenceRange && (
                          <span className="text-[#49739c] text-sm">
                            Reference: {finding.referenceRange}
                          </span>
                        )}
                      </div>
                      <p className="text-[#49739c] text-sm">
                        {finding.recommendation || finding.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#49739c] text-center py-8">
                  No key findings available yet. Analysis may still be in progress.
                </p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-[#cedbe8] p-6">
              <h2 className="text-[#0d141c] text-xl font-bold mb-4">
                Personalized Recommendations
              </h2>
              <ul className="space-y-3">
                {(analysis.analysis?.recommendations || analysis.recommendations) && (analysis.analysis?.recommendations || analysis.recommendations).length > 0 ? (
                  (analysis.analysis?.recommendations || analysis.recommendations).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#248bf3] rounded-full mt-2"></div>
                      <span className="text-[#0d141c] text-sm">{rec}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[#49739c] text-sm">No recommendations available yet.</p>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-[#cedbe8] p-6">
              <h2 className="text-[#0d141c] text-xl font-bold mb-4">
                Next Steps
              </h2>
              <ul className="space-y-3">
                {(analysis.analysis?.nextSteps || analysis.nextSteps) && (analysis.analysis?.nextSteps || analysis.nextSteps).length > 0 ? (
                  (analysis.analysis?.nextSteps || analysis.nextSteps).map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#248bf3] rounded-full mt-2"></div>
                      <span className="text-[#0d141c] text-sm">{step}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[#49739c] text-sm">No next steps available yet.</p>
                )}
              </ul>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-2xl border border-[#cedbe8] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#248bf3] rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                </svg>
              </div>
              <h3 className="text-[#0d141c] text-xl font-bold">Report Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] p-4 text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Download PDF</h4>
                    <p className="text-white/90 text-xs">Full report</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleDownloadData}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] p-4 text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Download Data</h4>
                    <p className="text-white/90 text-xs">Raw data</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleShareWithDoctor}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-4 text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Share</h4>
                    <p className="text-white/90 text-xs">With doctor</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleScheduleFollowUp}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-4 text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Schedule</h4>
                    <p className="text-white/90 text-xs">Follow-up</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails; 