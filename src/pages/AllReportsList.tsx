import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Card, CardContent, EmptyState, Button, Badge } from "../components/ui";
import { BarChart3, DownloadCloud, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

export function AllReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/analysis/results');
        setReports(res.data);
      } catch (err: any) {
        addToast("Failed to load reports", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [addToast]);

  const handleExportExcel = (id: string) => {
    window.location.href = `${api.defaults.baseURL}/analysis/results/${id}/export/xlsx`;
  };

  const handleExportCSV = (id: string) => {
    window.location.href = `${api.defaults.baseURL}/analysis/results/${id}/export/csv`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading reports...</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="pt-8">
        <EmptyState 
          icon={BarChart3}
          title="No Reports Generated"
          description="You haven't generated any reports yet. Upload an Excel file and generate a report from the Subject Rankings page."
        />
        <div className="flex justify-center mt-4 gap-4">
          <Link to="/dashboard/upload">
            <Button variant="outline">Upload Excel</Button>
          </Link>
          <Link to="/dashboard/rankings">
            <Button>Go to Rankings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Reports</h1>
        <Badge variant="outline" className="bg-white">{reports.length} Total</Badge>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-slate-900">{report.title}</h3>
                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                    {report.selectedSubjects.length} Subject(s)
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                  </span>
                  <span>
                    <strong>File:</strong> {report.job?.originalFileName || 'Unknown'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Subjects: </span>
                  <span className="font-medium text-slate-700">{report.selectedSubjects.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={() => handleExportCSV(report.id)} className="flex-1 md:flex-none">
                  <DownloadCloud className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel(report.id)} className="flex-1 md:flex-none text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                  <DownloadCloud className="w-4 h-4 mr-2" /> Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
