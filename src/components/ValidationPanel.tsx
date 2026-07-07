import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui";
import { AlertTriangle, CheckCircle2, FileJson, Columns, Search } from "lucide-react";

export function ValidationPanel({ data }: { data: any }) {
  const { totalRowsRead, parsedAttemptsCount, schools, sheetName, headerRowIndex, fixedSubjectMappings, groupSubjectMappings, ignoredColumnsCount } = data.metrics;
  const warnings = data.warnings || [];
  const schoolCount = schools ? Object.keys(schools).length : 0;
  const [filterType, setFilterType] = useState<string>("all");

  const filteredWarnings = useMemo(() => {
    if (filterType === "all") return warnings;
    return warnings.filter((w: any) => w.type === filterType);
  }, [warnings, filterType]);

  const warningTypes = Array.from(new Set(warnings.map((w: any) => w.type)));

  return (
    <div className="space-y-6">
      {/* Debug Summary Panel */}
      <Card className="shadow-sm border-blue-100">
        <CardHeader className="bg-blue-50 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <FileJson className="w-5 h-5" />
            Parser Debug Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-700">{sheetName}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide text-center">Target Sheet</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-700">{headerRowIndex}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide text-center">Header Row</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-700">{totalRowsRead}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide text-center">Rows Read</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-700">{schoolCount}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide text-center">Schools</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
              <span className="text-xl font-bold text-slate-700">{ignoredColumnsCount}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide text-center">Cols Ignored</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col items-center">
              <span className="text-xl font-bold text-emerald-700">{parsedAttemptsCount}</span>
              <span className="text-xs text-emerald-600 uppercase tracking-wide text-center">Valid Attempts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <Columns className="w-4 h-4 text-slate-400" /> Fixed Subject Mappings
              </h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {fixedSubjectMappings && fixedSubjectMappings.length > 0 ? (
                  fixedSubjectMappings.map((m: any, i: number) => <li key={i}>{m}</li>)
                ) : (
                  <li className="text-amber-600 italic">None detected. Check spelling.</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <Columns className="w-4 h-4 text-slate-400" /> Group Subject Mappings
              </h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {groupSubjectMappings && groupSubjectMappings.length > 0 ? (
                  groupSubjectMappings.map((m: any, i: number) => <li key={i}>{m}</li>)
                ) : (
                  <li className="text-amber-600 italic">None detected. Check spelling.</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings Panel */}
      <Card className="shadow-sm border-amber-100">
        <CardHeader className="bg-amber-50 border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            Validation Warnings ({warnings.length})
          </CardTitle>
          {warnings.length > 0 && (
            <div className="flex items-center gap-2 text-sm bg-white border border-amber-200 rounded-md px-2 py-1">
              <Search className="w-4 h-4 text-amber-500" />
              <select
                className="bg-transparent border-none focus:ring-0 text-amber-900 font-medium cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {warningTypes.map((type: any) => (
                  <option key={type} value={type}>{String(type).replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {warnings.length > 0 ? (
            <div className="max-h-80 overflow-y-auto border border-amber-200 rounded-md shadow-inner bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b">Row</th>
                    <th className="px-4 py-3 font-semibold border-b">Source</th>
                    <th className="px-4 py-3 font-semibold border-b">Type</th>
                    <th className="px-4 py-3 font-semibold border-b">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filteredWarnings.slice(0, 100).map((w: any, idx: number) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-amber-900">{w.rowNumber || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{w.sourceColumn || '-'}</td>
                      <td className="px-4 py-3 text-amber-700 capitalize whitespace-nowrap">
                        <span className="bg-amber-100 px-2 py-1 rounded-md text-xs font-medium">
                          {String(w.type).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{w.message}</td>
                    </tr>
                  ))}
                  {filteredWarnings.length > 100 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-amber-600 bg-amber-50/50 font-medium">
                        Showing first 100 of {filteredWarnings.length} filtered warnings. More exist.
                      </td>
                    </tr>
                  )}
                  {filteredWarnings.length === 0 && warnings.length > 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                        No warnings match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-emerald-700 bg-emerald-50 py-8 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
              <p className="font-semibold text-lg">All mapped data parsed cleanly! No validation warnings.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
