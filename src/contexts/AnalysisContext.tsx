import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '../lib/api';
import { useToast } from './ToastContext';

interface AnalysisContextType {
  activeJobId: string | null;
  processedData: any | null;
  isLoadingData: boolean;
  setProcessedData: (data: any) => void;
  clearAnalysis: () => void;
  reloadAnalysisJob: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const JOB_ID_KEY = 'examInsight.activeJobId';

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [processedData, setProcessedDataState] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { addToast } = useToast();

  const setProcessedData = useCallback((data: any) => {
    setProcessedDataState(data);
    if (data?.jobId) {
      setActiveJobId(data.jobId);
      sessionStorage.setItem(JOB_ID_KEY, data.jobId);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setProcessedDataState(null);
    setActiveJobId(null);
    sessionStorage.removeItem(JOB_ID_KEY);
  }, []);

  const reloadAnalysisJob = useCallback(async () => {
    const storedJobId = sessionStorage.getItem(JOB_ID_KEY);
    if (!storedJobId) return;

    setActiveJobId(storedJobId);
    setIsLoadingData(true);
    
    try {
      const res = await api.get(`/analysis/jobs/${storedJobId}`);
      if (res.data && res.data.metrics) {
        // We received the parsed data from the temporary store
        setProcessedDataState(res.data);
      } else {
        // Job exists in DB but data expired from memory
        setProcessedDataState(null);
        addToast('Your previous session data expired. Please re-upload your Excel file.', 'info');
        sessionStorage.removeItem(JOB_ID_KEY);
        setActiveJobId(null);
      }
    } catch (err: any) {
      console.error('Failed to load analysis job', err);
      setProcessedDataState(null);
      sessionStorage.removeItem(JOB_ID_KEY);
      setActiveJobId(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [addToast]);

  // Try to load state on initial mount
  useEffect(() => {
    if (!processedData) {
      reloadAnalysisJob();
    }
  }, [processedData, reloadAnalysisJob]);

  return (
    <AnalysisContext.Provider
      value={{
        activeJobId,
        processedData,
        isLoadingData,
        setProcessedData,
        clearAnalysis,
        reloadAnalysisJob
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
