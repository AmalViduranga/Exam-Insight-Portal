import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { UploadAndAnalysis } from './UploadAndAnalysis';
import { AllSchoolsReport } from '../components/AllSchoolsReport';
import { EmptyState, Button } from '../components/ui';
import { ListOrdered } from 'lucide-react';
import { AllReportsList } from './AllReportsList';

function DashboardHome() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />;
}

function SubjectRankingsRoute() {
  const { processedData, isLoadingData } = useAnalysis();

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading active session...</span>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="pt-8">
        <EmptyState 
          icon={ListOrdered}
          title="No Analysis Data Available"
          description="Please upload an Excel file first to generate subject rankings."
        />
        <div className="flex justify-center mt-4">
          <Link to="/dashboard/upload">
            <Button>Upload Excel</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <AllSchoolsReport data={processedData} />
    </div>
  );
}

export function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="upload" element={<UploadAndAnalysis />} />
      <Route path="rankings" element={<SubjectRankingsRoute />} />
      <Route path="reports" element={<AllReportsList />} />
    </Routes>
  );
}
