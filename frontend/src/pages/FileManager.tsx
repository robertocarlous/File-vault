
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Upload, Download, File, EyeOff, Archive } from 'lucide-react';
import lighthouse from '@lighthouse-web3/sdk';
import AiChat from '../components/AiChat';


interface FileItem {
  name: string;
  size: number;
  cid: string;
  uploadDate: Date;
  isHidden: boolean;
  isArchived: boolean;
}

const FileManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles");
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 90));
      }, 500);

      // Upload file to IPFS via Lighthouse
      const response = await lighthouse.upload(
        formData,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY || "YOUR_API_KEY"
      );

      clearInterval(interval);
      setUploadProgress(100);

      const newFile: FileItem = {
        name: selectedFile.name,
        size: selectedFile.size,
        cid: response.data.Hash,
        uploadDate: new Date(),
        isHidden: false,
        isArchived: false,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setError(null);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleHide = (cid: string) => {
    setUploadedFiles(
      uploadedFiles.map((file) =>
        file.cid === cid ? { ...file, isHidden: true } : file
      )
    );
  };

  const handleArchive = (cid: string) => {
    setUploadedFiles(
      uploadedFiles.map((file) =>
        file.cid === cid ? { ...file, isArchived: true } : file
      )
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const visibleFiles = uploadedFiles.filter((file) => !file.isHidden);

  return (
    <div className="min-h-screen pb-24" id="file-manager">
      <div className="max-w-[calc(100%-384px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-12">
        {/* First Container: Upload Section */}
        <div className="bg-card rounded-lg shadow-sm p-6 lg:p-8 border border-border">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              File Manager
            </h1>
            <p className="text-muted-foreground">
              Upload and manage your files securely on the decentralized web.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary file:text-primary-foreground
                    hover:file:cursor-pointer hover:file:bg-primary/90"
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            {isUploading && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Second Container: File List */}
        <div className="bg-card rounded-lg shadow-sm p-6 lg:p-8 border border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Your Files
            </h2>
            <div className="space-y-4">
              {visibleFiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No files uploaded yet. Upload your first file above!
                </p>
              ) : (
                <div className="grid gap-4">
                  {visibleFiles.map((file) => (
                    <div
                      key={file.cid}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <File className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Size: {formatBytes(file.size)} | Uploaded:{" "}
                            {formatDate(file.uploadDate)}
                            {file.isArchived && " | Archived"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col sm:flex-row mt-2 sm:mt-0 w-full sm:w-auto">
                        <a
                          href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </a>
                        {!file.isHidden && !file.isArchived && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleHide(file.cid)}
                              className="w-full sm:w-auto"
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleArchive(file.cid)}
                              className="w-full sm:w-auto"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Archived Files Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Archived Files
              </h3>
              {uploadedFiles.filter((file) => file.isArchived).length > 0 ? (
                <div className="grid gap-4">
                  {uploadedFiles
                    .filter((file) => file.isArchived)
                    .map((file) => (
                      <div
                        key={file.cid}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <File className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Size: {formatBytes(file.size)} | Uploaded:{" "}
                              {formatDate(file.uploadDate)} | Archived
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <a
                            href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No files have been archived yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <AiChat />
    </div>
  );
};

export default FileManager;
