import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { Card, CardContent, Button } from '../components/ui';
import { UploadCloud, FileText, ListOrdered, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserDashboard() {
  const { user } = useAuth();
  const { processedData, clearAnalysis } = useAnalysis();

  const actions = [
    { label: 'Upload Excel', icon: UploadCloud, path: '/dashboard/upload' },
    { label: 'Generate Report', icon: FileText, path: '/dashboard/upload' },
    { label: 'Subject Rankings', icon: ListOrdered, path: '/dashboard/rankings' },
    { label: 'Export Reports', icon: Download, path: '/dashboard/reports' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hello, {user?.fullName}</h1>
          <p className="text-slate-500 mt-1 text-lg">Upload exam result sheets, filter results, generate reports, and export final summaries.</p>
        </div>
      </div>

      {processedData && (
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Active Analysis Session
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  <strong>File:</strong> {processedData.job?.originalFileName || processedData.metrics?.sheetName || 'Recent Upload'}
                </p>
                <div className="flex gap-4 text-sm font-medium text-slate-700">
                  <span className="bg-white px-3 py-1 rounded-full border shadow-sm">{processedData.metrics?.totalRowsRead || 0} Rows</span>
                  <span className="bg-white px-3 py-1 rounded-full border shadow-sm">{Object.keys(processedData.metrics?.schools || {}).length} Schools</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/dashboard/rankings">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Continue Analysis</Button>
                </Link>
                <Button variant="outline" onClick={clearAnalysis} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, i) => (
          <Link key={i} to={action.path} className="group">
            <Card className="h-full hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-indigo-100">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Subject Shortcuts</h2>
        <div className="flex flex-wrap gap-3">
          {['60', '63', '81', '84', '85', '88', '89'].map((subject) => (
            <Link key={subject} to="/dashboard/rankings">
              <Button variant="outline" className="font-medium text-slate-700 hover:text-indigo-700 hover:border-indigo-300 bg-white">
                Subject {subject}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Reports empty state */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h2>
        <Card className="border-dashed border-2 shadow-none">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-10 h-10 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No recent reports</p>
            <p className="text-slate-500 max-w-md mt-1">Generate a new report from the subject ranking or report pages to see it here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
