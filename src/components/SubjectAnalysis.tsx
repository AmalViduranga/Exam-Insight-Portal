import { useState } from "react";
import { api } from "../lib/api";
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from "./ui";
import { ArrowLeft, Loader2, BarChart2 } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

interface SubjectAnalysisProps {
  data: any;
  schoolId: string;
  onBack: () => void;
}

const COMMON_SUBJECTS = ["60", "63", "81", "84", "85", "88", "89"];

export function SubjectAnalysis({ data, schoolId, onBack }: SubjectAnalysisProps) {
  const [subjectInput, setSubjectInput] = useState("");
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleCalculate = async (sub: string) => {
    setSubjectInput(sub);
    if (!sub) {
      setStats(null);
      return;
    }

    setLoading(true);
    setStats(null);

    try {
      const res = await api.post(`/analysis/jobs/${data.jobId}/school-stats`, {
        schoolId,
        subjectNo: sub
      });
      setStats(res.data);
      addToast(`Analyzed Subject ${sub}`, "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Error calculating stats', "error");
    } finally {
      setLoading(false);
    }
  };

  const school = data.metrics?.schools[schoolId] || data.schools?.[schoolId];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schools
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">
            {school?.name}
          </h2>
          <span className="text-sm font-medium text-slate-500 font-mono">ID: {schoolId}</span>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
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
              {loading ? 'Analyzing...' : 'Analyze Subject'}
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

      {stats && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Did / Applied" value={stats.totalDid} />
            <StatCard title="Sat Count" value={stats.satCount} />
            <StatCard title="Absent Count" value={stats.absentCount} />
            <StatCard title="Absent %" value={`${stats.absentPercentage}%`} />
            <StatCard title="Pass Count" value={stats.passCount} className="bg-emerald-50 border-emerald-200 text-emerald-800" />
            <StatCard title="Pass %" value={`${stats.passPercentage}%`} className="bg-emerald-100 border-emerald-300 text-emerald-900" />
            <StatCard title="Fail Count (W)" value={stats.failCount} className="bg-rose-50 border-rose-200 text-rose-800" />
            <StatCard title="Fail %" value={`${stats.wPercentage}%`} className="bg-rose-100 border-rose-300 text-rose-900" />
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Detailed Grade Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/3">Grade</th>
                    <th className="px-6 py-4 font-semibold text-right w-1/3">Count</th>
                    <th className="px-6 py-4 font-semibold text-right w-1/3">Percentage (of Sat)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <GradeRow grade="A" count={stats.aCount} percentage={stats.aPercentage} colorClass="text-emerald-700 bg-emerald-50/30 font-bold" />
                  <GradeRow grade="B" count={stats.bCount} percentage={stats.bPercentage} colorClass="text-blue-700 bg-blue-50/30 font-semibold" />
                  <GradeRow grade="C" count={stats.cCount} percentage={stats.cPercentage} colorClass="text-indigo-700 bg-indigo-50/30 font-semibold" />
                  <GradeRow grade="S" count={stats.sCount} percentage={stats.sPercentage} colorClass="text-amber-700 bg-amber-50/30 font-semibold" />
                  <GradeRow grade="W" count={stats.wCount} percentage={stats.wPercentage} colorClass="text-rose-700 bg-rose-50/30 font-medium" />
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="px-6 py-4">Total Sat</td>
                    <td className="px-6 py-4 text-right">{stats.satCount}</td>
                    <td className="px-6 py-4 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, className }: { title: string, value: string | number, className?: string }) {
  return (
    <div className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md ${className || ''}`}>
      <span className="text-sm font-semibold opacity-70 mb-2">{title}</span>
      <span className="text-3xl font-extrabold tracking-tight">{value}</span>
    </div>
  );
}

function GradeRow({ grade, count, percentage, colorClass }: { grade: string, count: number, percentage: string, colorClass?: string }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className={`px-6 py-4 font-bold text-base ${colorClass || ''}`}>{grade}</td>
      <td className="px-6 py-4 text-right text-base font-medium">{count}</td>
      <td className="px-6 py-4 text-right text-base text-slate-500">{percentage}%</td>
    </tr>
  );
}
