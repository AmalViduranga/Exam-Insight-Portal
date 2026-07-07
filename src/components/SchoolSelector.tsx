import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from "./ui";
import { Search } from "lucide-react";

interface SchoolSelectorProps {
  data: any;
  onSelect: (schoolId: string) => void;
}

export function SchoolSelector({ data, onSelect }: SchoolSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const schools = data.metrics?.schools || data.schools || {};
  const schoolList = useMemo(() => {
    return Object.values(schools).sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
  }, [schools]);

  const filtered = schoolList.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader className="bg-slate-50 border-b pb-4">
        <CardTitle className="text-xl">Select a School</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by school name or ID..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border rounded-md overflow-hidden bg-white max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold">School ID</th>
                <th className="px-4 py-3 font-semibold">School Name</th>
                <th className="px-4 py-3 font-semibold">Zone</th>
                <th className="px-4 py-3 font-semibold">Province</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length > 0 ? (
                filtered.map((school: any) => (
                  <tr key={school.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-medium">{school.id}</td>
                    <td className="px-4 py-3">{school.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{school.zone || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{school.province || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onSelect(school.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No schools found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
