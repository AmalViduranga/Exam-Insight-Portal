import { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { ValidationPanel } from "../components/ValidationPanel";
import { SchoolSelector } from "../components/SchoolSelector";
import { SubjectAnalysis } from "../components/SubjectAnalysis";
import { AllSchoolsReport } from "../components/AllSchoolsReport";
import { AlertCircle } from "lucide-react";
import { useAnalysis } from "../contexts/AnalysisContext";

export function UploadAndAnalysis() {
  const { processedData, setProcessedData, clearAnalysis, isLoadingData } = useAnalysis();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schools" | "all-schools">("schools");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const handleDataProcessed = (data: any) => {
    setProcessedData(data);
    setErrorMsg(null);
    setSelectedSchoolId(null);
    setActiveTab("schools");
  };

  const handleFileError = (msg: string) => {
    setErrorMsg(msg);
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading active session...</span>
      </div>
    );
  }

  return (
    <>
      {processedData && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => clearAnalysis()}
            className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Clear Analysis & Upload New File
          </button>
        </div>
      )}

      {!processedData ? (
        <>
          {errorMsg && (
            <div className="max-w-xl mx-auto mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}
          <FileUpload onDataProcessed={handleDataProcessed} onFileError={handleFileError} />
        </>
      ) : (
        <div className="space-y-8">
          <ValidationPanel data={processedData} />
          
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => { setActiveTab("schools"); setSelectedSchoolId(null); }}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "schools" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Single School Analysis
              </button>
              <button
                onClick={() => { setActiveTab("all-schools"); setSelectedSchoolId(null); }}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "all-schools" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                All Schools Report
              </button>
            </div>
          </div>

          {activeTab === "schools" && !selectedSchoolId && (
            <SchoolSelector data={processedData} onSelect={setSelectedSchoolId} />
          )}
          
          {activeTab === "schools" && selectedSchoolId && (
            <SubjectAnalysis
              data={processedData}
              schoolId={selectedSchoolId}
              onBack={() => setSelectedSchoolId(null)}
            />
          )}

          {activeTab === "all-schools" && (
            <AllSchoolsReport data={processedData} />
          )}
        </div>
      )}
    </>
  );
}
