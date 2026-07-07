import { useCallback, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { Card, CardContent } from "./ui";

interface FileUploadProps {
  onDataProcessed: (data: any) => void;
  onFileError: (msg: string) => void;
}

export function FileUpload({ onDataProcessed, onFileError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sheetName', 'Summary'); // Fallback or configurable later

      try {
        const response = await api.post('/analysis/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data) {
          onDataProcessed(response.data);
        }
      } catch (err: any) {
        onFileError(err.response?.data?.message || err.message || "An error occurred while uploading the file.");
      } finally {
        setIsUploading(false);
      }
    },
    [onDataProcessed, onFileError]
  );

  return (
    <Card className="w-full max-w-xl mx-auto mt-10 shadow-lg border border-primary/10">
      <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center space-y-4">
        <div className="bg-primary/5 p-4 rounded-full">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 text-primary" />
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight mb-2 text-foreground">
            {isUploading ? "Uploading & Analyzing..." : "Upload Exam Results"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Drag and drop your Excel sheet here or click to browse. Supported formats: .xlsx, .xls
          </p>
        </div>
        <label className={`cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-8 py-2 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          Select Excel File
          <input
            type="file"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
        
        <div className="mt-8 pt-6 border-t border-border w-full text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            File will be securely uploaded and analyzed on the server.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
