// PDF Generation Utilities

export const generateReportPDF = (report, analysis) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blood Test Report - ${report.title || 'Health Insights'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #248bf3;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #248bf3;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #0d141c;
          border-bottom: 1px solid #cedbe8;
          padding-bottom: 10px;
          font-size: 20px;
        }
        .score-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .score {
          font-size: 48px;
          font-weight: bold;
          color: #248bf3;
          margin: 10px 0;
        }
        .findings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .finding-item {
          border: 1px solid #cedbe8;
          padding: 15px;
          border-radius: 8px;
          background: #fff;
        }
        .finding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .finding-title {
          font-weight: bold;
          font-size: 16px;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-normal {
          background: #d4edda;
          color: #155724;
        }
        .status-high {
          background: #f8d7da;
          color: #721c24;
        }
        .status-low {
          background: #fff3cd;
          color: #856404;
        }
        .recommendations {
          list-style: none;
          padding: 0;
        }
        .recommendations li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .recommendations li:before {
          content: "•";
          color: #248bf3;
          font-weight: bold;
          margin-right: 10px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #cedbe8;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Blood Test Analysis Report</h1>
        <p><strong>Report Date:</strong> ${new Date(report.createdAt).toLocaleDateString()}</p>
        <p><strong>File:</strong> ${report.originalFileName}</p>
        <p><strong>Status:</strong> ${report.status}</p>
      </div>

      ${analysis.analysis?.healthScore || analysis.analysis?.overallScore ? `
      <div class="score-section">
        <h2>Overall Health Score</h2>
        <div class="score">${analysis.analysis?.healthScore || analysis.analysis?.overallScore}/100</div>
        <p>${analysis.analysis?.summary || 'Analysis summary not available'}</p>
      </div>
      ` : ''}

      ${(analysis.analysis?.keyFindings || analysis.keyFindings) ? `
      <div class="section">
        <h2>Key Findings</h2>
        <div class="findings-grid">
          ${(analysis.analysis?.keyFindings || analysis.keyFindings).map(finding => `
            <div class="finding-item">
              <div class="finding-header">
                <span class="finding-title">${finding.parameter || finding.name}</span>
                ${finding.status ? `<span class="status-badge status-${finding.status}">${finding.status}</span>` : ''}
              </div>
              ${finding.value ? `<p><strong>Your Value:</strong> ${finding.value}</p>` : ''}
              ${finding.referenceRange ? `<p><strong>Reference Range:</strong> ${finding.referenceRange}</p>` : ''}
              ${finding.recommendation ? `<p><strong>Recommendation:</strong> ${finding.recommendation}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${(analysis.analysis?.recommendations || analysis.recommendations) ? `
      <div class="section">
        <h2>Personalized Recommendations</h2>
        <ul class="recommendations">
          ${(analysis.analysis?.recommendations || analysis.recommendations).map(rec => `
            <li>${rec}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      ${(analysis.analysis?.nextSteps || analysis.nextSteps) ? `
      <div class="section">
        <h2>Next Steps</h2>
        <ul class="recommendations">
          ${(analysis.analysis?.nextSteps || analysis.nextSteps).map(step => `
            <li>${step}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="footer">
        <p>This report was generated by Health Insights AI Analysis Platform</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p><strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};

export const downloadReportData = (report, analysis) => {
  // Create JSON data for download
  const reportData = {
    report: {
      id: report._id,
      title: report.title,
      createdAt: report.createdAt,
      status: report.status,
      originalFileName: report.originalFileName
    },
    analysis: analysis.analysis || analysis,
    generatedAt: new Date().toISOString()
  };

  const dataStr = JSON.stringify(reportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `blood-test-report-${report._id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 