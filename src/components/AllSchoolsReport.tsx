import { useState, useMemo } from "react";
import { api } from "../lib/api";
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from "./ui";
import { DownloadCloud, Loader2, Search } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

interface AllSchoolsReportProps {
  data: any;
}

const COMMON_SUBJECTS = ["60", "63", "81", "84", "85", "88", "89"];

export function AllSchoolsReport({ data }: AllSchoolsReportProps) {
  const [subjectInput, setSubjectInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  const handleCalculate = async (sub: string) => {
    setSubjectInput(sub);
    if (!sub) {
      setResults([]);
      setResultId(null);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const res = await api.post(`/analysis/jobs/${data.jobId}/report`, {
        subjects: [sub],
        title: `All Schools Report - Subject ${sub}`
      });
      const generatedResultId = res.data.resultId;
      setResultId(generatedResultId);

      const reportRes = await api.get(`/analysis/results/${generatedResultId}`);
      
      const sortedRows = reportRes.data.rows.sort((a: any, b: any) => a.rank - b.rank);
      setResults(sortedRows);
      addToast(`Generated report for Subject ${sub}`, "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Error generating report', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!resultId) return;
    window.location.href = `${api.defaults.baseURL}/analysis/results/${resultId}/export/xlsx`;
  };

  const handleExportCSV = async () => {
    if (!resultId) return;
    window.location.href = `${api.defaults.baseURL}/analysis/results/${resultId}/export/csv`;
  };

  const filteredResults = useMemo(() => {
    if (!searchTerm) return results;
    const lower = searchTerm.toLowerCase();
    return results.filter(r => 
      r.schoolName.toLowerCase().includes(lower) || 
      r.schoolId.toString().includes(lower)
    );
  }, [results, searchTerm]);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <CardTitle className="text-xl">Generate Ranking Report</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Enter Subject Number</label>
          <div className="flex gap-3 mb-6">
            <Input
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. 60"
              className="max-w-[250px]"
            />
            <Button onClick={() => handleCalculate(subjectInput)} disabled={loading} className="px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick Select Subjects</div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SUBJECTS.map((sub) => (
                <Button
                  key={sub}
                  variant={subjectInput === sub ? "default" : "outline"}
                  onClick={() => handleCalculate(sub)}
                  size="sm"
                  disabled={loading}
                  className="min-w-[4rem]"
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 border-b gap-4 py-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Rankings for Subject {subjectInput}</CardTitle>
              <Badge variant="outline" className="bg-white">{results.length} Schools</Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:min-w-[250px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input 
                  placeholder="Search school name or ID..." 
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <DownloadCloud className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                  <DownloadCloud className="w-4 h-4 mr-2" /> Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
              <thead className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center w-16">Rank</th>
                  <th className="px-4 py-3 font-semibold">School ID</th>
                  <th className="px-4 py-3 font-semibold">School Name</th>
                  <th className="px-4 py-3 font-semibold text-right">Sat</th>
                  <th className="px-4 py-3 font-semibold text-right">A</th>
                  <th className="px-4 py-3 font-semibold text-right">B</th>
                  <th className="px-4 py-3 font-semibold text-right">C</th>
                  <th className="px-4 py-3 font-semibold text-right">S</th>
                  <th className="px-4 py-3 font-semibold text-right">W</th>
                  <th className="px-4 py-3 font-semibold text-right">Absent</th>
                  <th className="px-4 py-3 font-semibold text-right text-emerald-700 bg-emerald-50/30">Pass Count</th>
                  <th className="px-4 py-3 font-semibold text-right text-emerald-700 bg-emerald-50/50">Pass %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                      No schools found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${r.rank === 1 ? 'bg-amber-100 text-amber-700' : r.rank === 2 ? 'bg-slate-200 text-slate-700' : r.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'}`}>
                          {r.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">{r.schoolId}</td>
                      <td className="px-4 py-3 max-w-[250px] truncate font-medium text-slate-900" title={r.schoolName}>{r.schoolName}</td>
                      <td className="px-4 py-3 text-right">{r.satCount}</td>
                      <td className="px-4 py-3 text-right"><span className="font-medium">{r.aCount}</span> <span className="text-xs text-slate-400">({r.aPercentage}%)</span></td>
                      <td className="px-4 py-3 text-right"><span className="font-medium">{r.bCount}</span> <span className="text-xs text-slate-400">({r.bPercentage}%)</span></td>
                      <td className="px-4 py-3 text-right"><span className="font-medium">{r.cCount}</span> <span className="text-xs text-slate-400">({r.cPercentage}%)</span></td>
                      <td className="px-4 py-3 text-right"><span className="font-medium">{r.sCount}</span> <span className="text-xs text-slate-400">({r.sPercentage}%)</span></td>
                      <td className="px-4 py-3 text-right"><span className="font-medium">{r.wCount}</span> <span className="text-xs text-slate-400">({r.wPercentage}%)</span></td>
                      <td className="px-4 py-3 text-right text-slate-500">{r.absentCount}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700 bg-emerald-50/30">{r.passCount}</td>
                      <td className="px-4 py-3 text-right bg-emerald-50/50">
                        <Badge variant="success" className="font-bold text-sm px-2 py-1">{r.passPercentage}%</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
