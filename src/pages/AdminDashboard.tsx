import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { Card, CardContent, Button } from '../components/ui';
import { Users, FileSpreadsheet, Activity, ListOrdered, UploadCloud, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();
  const { processedData, clearAnalysis } = useAnalysis();

  const stats = [
    { title: 'Total Users', value: '4', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Users', value: '3', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Reports', value: '12', icon: FileSpreadsheet, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Recent Uploads', value: '2', icon: UploadCloud, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const quickActions = [
    { label: 'Create New User', desc: 'Add admins or users', icon: Users, path: '/admin/users' },
    { label: 'Upload Excel Sheet', desc: 'Import raw exam data', icon: UploadCloud, path: '/dashboard/upload' },
    { label: 'View Reports', desc: 'School & subject stats', icon: FileText, path: '/dashboard/reports' },
    { label: 'Subject Ranking', desc: 'Pass rates & ranks', icon: ListOrdered, path: '/dashboard/rankings' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.fullName}</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage users, upload result sheets, generate reports, and monitor system activity.</p>
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
        {stats.map((s, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.bg} ${s.color}`}>
                <s.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{s.title}</p>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className="group">
              <Card className="h-full hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-indigo-100">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1 group-hover:text-indigo-700 transition-colors">{action.label}</span>
                    <span className="text-sm text-slate-500">{action.desc}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Activity empty state (if no data exists) */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
        <Card className="border-dashed border-2 shadow-none">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Activity className="w-10 h-10 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No recent activity</p>
            <p className="text-slate-500 max-w-md mt-1">When users upload sheets or generate reports, recent activity will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
