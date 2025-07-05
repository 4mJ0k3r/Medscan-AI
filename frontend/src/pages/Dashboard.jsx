import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { bloodTestAPI, healthFactsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalReports: 0,
    analyzedReports: 0,
    processingReports: 0,
    averageScore: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReports, setShowAllReports] = useState(false);
  const [healthFacts, setHealthFacts] = useState([
    {
      text: "Cholesterol levels can vary by up to 20% based on seasonal changes and stress levels.",
      category: "Cholesterol"
    },
    {
      text: "Vitamin D deficiency affects over 1 billion people worldwide and impacts immune function.",
      category: "Vitamins"
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Reset dashboard data to show loading state
        setDashboardData({
          totalReports: 0,
          analyzedReports: 0,
          processingReports: 0,
          averageScore: 0
        });
        
        // Fetch recent reports for display
        const reportsResponse = await bloodTestAPI.getReports({ limit: 6, sort: '-createdAt' });
        
        // Fetch all reports for accurate statistics
        const allReportsResponse = await bloodTestAPI.getReports({ limit: 100, sort: '-createdAt' });
        
        if (reportsResponse.data.success) {
          const reports = reportsResponse.data.data?.reports || reportsResponse.data.data || [];
          setRecentReports(reports);
          
          // Use all reports for statistics calculation
          const allReportsData = allReportsResponse.data.success ? 
            (allReportsResponse.data.data?.reports || allReportsResponse.data.data || []) : 
            reports;
          
          // Generate basic stats from all reports
          const totalReports = allReportsData.length;
          const analyzedReports = allReportsData.filter(r => {
            // Check multiple conditions for analyzed reports
            const hasAnalysis = r.analysis && (r.analysis.healthScore || r.analysis.overallScore || r.analysis.summary);
            const isAnalyzed = r.status === 'completed' || r.status === 'analyzed' || r.status === 'Analyzed';
            const hasScore = r.healthScore || r.overallScore;
            return hasAnalysis || isAnalyzed || hasScore;
          }).length;
          const processingReports = allReportsData.filter(r => 
            r.status === 'processing' || r.status === 'Processing'
          ).length;
          
          const scoresArray = allReportsData
            .filter(r => r.analysis?.healthScore || r.analysis?.overallScore)
            .map(r => r.analysis?.healthScore || r.analysis?.overallScore);
          
          const avgScore = scoresArray.length > 0 ? 
            scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length : 0;
          
          const fallbackStats = {
            totalReports,
            analyzedReports,
            processingReports,
            averageScore: avgScore
          };
          
          // Try to fetch dashboard stats
          try {
            const statsResponse = await bloodTestAPI.getDashboardStats();
            
            if (statsResponse.data.success && statsResponse.data.data) {
              // Extract stats from the nested structure
              const apiStats = statsResponse.data.data.stats || statsResponse.data.data;
              
              setDashboardData({
                totalReports: apiStats.totalReports || 0,
                analyzedReports: apiStats.analyzedReports || 0,
                processingReports: apiStats.processingReports || 0,
                averageScore: apiStats.averageScore || 0
              });
            } else {
              setDashboardData(fallbackStats);
            }
          } catch (statsError) {
            setDashboardData(fallbackStats);
          }
        } else {
          // If reports fetch failed, set default data
          setDashboardData({
            totalReports: 0,
            analyzedReports: 0,
            processingReports: 0,
            averageScore: 0
          });
        }
      } catch (error) {
        // Handle error silently - dashboard data already has default values
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchHealthFacts();
  }, []);

  const fetchHealthFacts = async () => {
    try {
      const response = await healthFactsAPI.getRandomFacts(2);
      if (response.data.success && response.data.data.length > 0) {
        setHealthFacts(response.data.data);
      }
    } catch (error) {
      // Keep default facts if API fails
      console.log('Using default health facts');
    }
  };

  const fetchAllReports = async () => {
    try {
      const response = await bloodTestAPI.getReports({ limit: 50, sort: '-createdAt' });
      
      if (response.data.success) {
        const reports = response.data.data?.reports || response.data.data || [];
        setAllReports(reports);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleViewAllReports = async () => {
    if (!showAllReports && allReports.length === 0) {
      await fetchAllReports();
    }
    setShowAllReports(!showAllReports);
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-6 py-8 max-w-[1200px] mx-auto flex flex-col gap-12">
          {/* Welcome Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#248bf3] via-[#0c7ff2] to-[#0066cc] p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20 ring-4 ring-white/20 shadow-xl"
                  style={{
                    backgroundImage: `url("${user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYkcV9l1g9Aigafs2LCqHAaWLHlwTNC9xf7qXc31a99W1KF2qorhTIMkE5_e-RTDL3owcxbvCjOWqHtMf0zWgW3ZLvKnFRVToNK7YiIcITW3kcm_JUemHpfwdQ-8otMi9aTc4CMD1PlROQ5dh4-43pYCeTPNR3dNFjQyBHkaF00WaLgC3rz5s_zfveOfYif5BqrEeWJ3hIC1OPk_6SE1z_8ltEQ30bZb_X88bnv5cKpqRbx9-uTFZxoLmCoNCDj08Ccr9bpJ2XwdI'}")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-4xl font-black text-white">
                    Welcome back, {user?.name || 'User'}!
                  </h1>
                  <p className="text-lg text-white/90">
                    Ready to analyze your blood test results?
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                      </svg>
                      Last login: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-auto hidden md:block">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">System Active</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0d141c]">Health Analytics Overview</h2>
              <div className="flex items-center gap-2 text-[#49739c] text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                </svg>
                Updated just now
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Reports"
                value={dashboardData?.totalReports || 0}
                icon="📊"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                description="All uploaded reports"
                trend="+2 this month"
              />
              <StatCard
                title="Analyzed Reports"
                value={dashboardData?.analyzedReports || 0}
                icon="✅"
                color="bg-gradient-to-br from-green-500 to-green-600"
                description="Completed analysis"
                trend="85% completion rate"
              />
              <StatCard
                title="Processing"
                value={dashboardData?.processingReports || 0}
                icon="⏳"
                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                description="Currently analyzing"
                trend="~3 min avg time"
              />
              <StatCard
                title="Average Score"
                value={dashboardData?.averageScore ? `${Math.round(dashboardData.averageScore)}/100` : 'N/A'}
                icon="🎯"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                description="Health score average"
                trend="Above normal range"
              />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-2xl border border-[#cedbe8] p-8">
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-[#0d141c] text-3xl font-bold leading-tight mb-3">
                  Quick Actions
                </h2>
                <p className="text-[#49739c] text-lg">
                  Get started with your health analysis journey
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  to="/upload"
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#248bf3] to-[#0c7ff2] p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32px"
                        height="32px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Upload Report</h3>
                      <p className="text-white/90 text-sm">
                        Upload your blood test and get AI-powered insights
                      </p>
                    </div>
                  </div>
                </Link>
                
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16.24,16.24,0,0,0-6.36-12.79A87.55,87.55,0,0,1,40,104a88,88,0,0,1,176,0Zm-16,0a72,72,0,0,0-144,0,71.64,71.64,0,0,0,27.71,56.59A32.15,32.15,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.29-25.41A71.64,71.64,0,0,0,200,104Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Health Tips</h3>
                      <p className="text-white/90 text-sm">
                        Get personalized health recommendations
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Schedule</h3>
                      <p className="text-white/90 text-sm">
                        Book follow-up appointments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0d141c] text-[22px] font-bold">
                Recent Reports
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-[#49739c] text-sm">
                  {dashboardData?.totalReports || 0} total reports
                </p>
                {recentReports.length > 0 && (
                  <button 
                    onClick={handleViewAllReports}
                    className="text-[#248bf3] text-sm font-medium hover:underline"
                  >
                    {showAllReports ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#248bf3]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(showAllReports ? allReports : recentReports).length > 0 ? (
                  (showAllReports ? allReports : recentReports).map((report) => (
                    <ReportCard
                      key={report._id}
                      reportId={report._id}
                      title={report.title || `Blood Test - ${new Date(report.createdAt).toLocaleDateString()}`}
                      status={report.status}
                      summary={report.analysis?.summary || (report.status === 'processing' ? 'Analysis in progress...' : 'Analysis pending...')}
                      date={report.createdAt}
                      healthScore={report.analysis?.healthScore || report.analysis?.overallScore}
                      fileName={report.originalFileName}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-[#cedbe8] bg-gradient-to-br from-white to-[#f8f9fa] p-12 text-center">
                    <div className="w-16 h-16 bg-[#e7f3ff] rounded-2xl flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32px"
                        height="32px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="text-[#248bf3]"
                      >
                        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[#0d141c] text-lg font-bold">No Reports Yet</h3>
                      <p className="text-[#49739c] text-sm max-w-md">
                        Upload your first blood test report to get AI-powered insights and personalized health recommendations
                      </p>
                    </div>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 bg-[#248bf3] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0c7ff2] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z" />
                      </svg>
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Health Insights Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0d141c] text-2xl font-bold">
                Health Insights & Tips
              </h2>
              <button className="text-[#248bf3] text-sm font-medium hover:underline">
                View All Tips
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <HealthTip
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16.24,16.24,0,0,0-6.36-12.79A87.55,87.55,0,0,1,40,104a88,88,0,0,1,176,0Zm-16,0a72,72,0,0,0-144,0,71.64,71.64,0,0,0,27.71,56.59A32.15,32.15,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.29-25.41A71.64,71.64,0,0,0,200,104Z" />
                  </svg>
                }
                title="Regular Testing"
                description="Get your blood work done every 6-12 months to track your health trends and catch issues early."
                category="Prevention"
              />
              
              <HealthTip
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40Z" />
                  </svg>
                }
                title="Stay Hydrated"
                description="Drink plenty of water before your blood test for accurate results and better vein visibility."
                category="Preparation"
              />
              
              <HealthTip
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v52h32A8,8,0,0,1,168,148Z"/>
                  </svg>
                }
                title="Fasting Guidelines"
                description="Follow proper fasting instructions (8-12 hours) for lipid and glucose tests to ensure accuracy."
                category="Preparation"
              />
            </div>
            
            {/* Additional Health Metrics */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl border border-[#bae6fd] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#248bf3] rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                    </svg>
                  </div>
                  <h3 className="text-[#0d141c] text-lg font-bold">Did You Know?</h3>
                </div>
                <button 
                  onClick={fetchHealthFacts}
                  className="flex items-center gap-2 px-3 py-1 bg-[#248bf3] text-white rounded-lg hover:bg-[#0c7ff2] transition-colors text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M197.67,186.37a8,8,0,0,1,0,11.29C196.58,198.73,170.82,224,128,224c-37.39,0-64.53-22.4-80-39.85C31.47,167.23,8.18,134.88,8.01,134.56a8,8,0,0,1,0-13.12C8.18,121.12,31.47,88.77,48,71.85,63.47,54.4,90.61,32,128,32c42.82,0,68.58,25.27,69.67,26.34a8,8,0,0,1-11.29,11.32C185.75,69.13,165,48,128,48c-32.35,0-54.26,18.7-68,32.35C44.5,96.5,22.24,125.15,16.4,134c5.84,8.85,28.1,37.5,43.6,53.65C73.74,201.3,95.65,208,128,208c37,0,57.75-21.13,58.38-21.66A8,8,0,0,1,197.67,186.37Z"/>
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthFacts.map((fact, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#248bf3] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#0d141c] text-sm leading-relaxed">
                        {fact.category && <strong>{fact.category}: </strong>}
                        {fact.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ reportId, title, status, summary, date, healthScore, fileName }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'analyzed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusDisplayText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'analyzed':
        return 'Analyzed';
      case 'processing':
        return 'Processing';
      case 'failed':
      case 'error':
        return 'Failed';
      case 'uploaded':
        return 'Uploaded';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <Link
      to={`/report/${reportId}`}
      className="flex flex-col gap-3 rounded-xl border border-[#cedbe8] bg-white p-5 hover:shadow-lg hover:border-[#248bf3] transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[#0d141c] text-base font-bold leading-tight group-hover:text-[#248bf3] transition-colors">
          {title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)} flex-shrink-0`}>
          {getStatusDisplayText(status)}
        </span>
      </div>
      
      <p className="text-[#49739c] text-sm line-clamp-2 leading-relaxed">
        {summary}
      </p>
      
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#49739c] text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
            </svg>
            {new Date(date).toLocaleDateString()}
          </div>
          {healthScore && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getHealthScoreColor(healthScore)}`}>
              {healthScore}/100
            </span>
          )}
        </div>
        
        {fileName && (
          <div className="flex items-center gap-1 text-[#49739c] text-xs bg-[#f8f9fa] px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/>
            </svg>
            <span className="truncate">{fileName}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

const HealthTip = ({ icon, title, description, category }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-[#cedbe8] bg-white p-6 hover:shadow-lg hover:border-[#248bf3] transition-all duration-200 group">
    <div className="flex items-center justify-between">
      <div className="text-[#248bf3] bg-[#e7f3ff] p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
        {icon}
      </div>
      {category && (
        <span className="text-xs px-2 py-1 bg-[#f0f9ff] text-[#248bf3] rounded-full font-medium">
          {category}
        </span>
      )}
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-[#0d141c] text-lg font-bold group-hover:text-[#248bf3] transition-colors">
        {title}
      </h3>
      <p className="text-[#49739c] text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color, description, trend }) => (
  <div className="bg-white rounded-xl border border-[#cedbe8] p-6 hover:shadow-xl transition-all duration-300 hover:border-[#248bf3] group hover:scale-105">
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-right">
          <h3 className="text-3xl font-bold text-[#0d141c] group-hover:text-[#248bf3] transition-colors">
            {value}
          </h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-[#0d141c] text-base font-semibold">{title}</p>
        {description && (
          <p className="text-[#49739c] text-xs">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;