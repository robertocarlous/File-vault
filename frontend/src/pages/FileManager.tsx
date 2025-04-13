import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Upload, Download, File, EyeOff, Archive } from 'lucide-react';
import lighthouse from '@lighthouse-web3/sdk';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
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
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 90));
      }, 500);

      // Upload file to IPFS via Lighthouse
      const response = await lighthouse.upload(formData, process.env.REACT_APP_LIGHTHOUSE_API_KEY || 'YOUR_API_KEY');

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
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleHide = (cid: string) => {
    setUploadedFiles(uploadedFiles.map(file => 
      file.cid === cid ? { ...file, isHidden: true } : file
    ));
  };

  const handleArchive = (cid: string) => {
    setUploadedFiles(uploadedFiles.map(file => 
      file.cid === cid ? { ...file, isArchived: true } : file
    ));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const visibleFiles = uploadedFiles.filter(file => !file.isHidden);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* First Container: Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">File Manager</h1>
            <p className="text-gray-600 leading-relaxed">
              Welcome to your secure file management hub! Here, you can upload and manage your files on the decentralized web using Filecoin and Lighthouse. Please note that once files are uploaded to the blockchain and IPFS, they are permanent and cannot be deleted. However, you can hide them from this list or archive them for organization. Start by selecting a file to upload below.
            </p>
          </div>

          {/* Upload Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New File</h2>
            <p className="text-gray-600 mb-4">
              Upload your files securely. Each file will be stored on IPFS with end-to-end encryption and a unique CID for retrieval.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <Upload className="h-5 w-5 mr-2" />
                Select File
              </label>
              {selectedFile && (
                <div className="w-full sm:w-auto">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full sm:w-auto inline-flex items-center"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                  {isUploading && (
                    <div className="mt-2 text-sm text-gray-500">
                      Upload Progress: {uploadProgress}%
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedFile && !isUploading && (
              <div className="mt-4 text-sm text-gray-500">
                Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
              </div>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        {/* Second Container: File List and Archived Files */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Files</h2>
            <p className="text-gray-600 mb-4">
              Below is a list of all visible files you’ve uploaded. Files on the blockchain are permanent, but you can hide or archive them here for better organization. Use the CID to download files anytime via a supported gateway.
            </p>
            <div className="space-y-4">
              {visibleFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No visible files uploaded yet. Upload your first file or check your archived files!
                </p>
              ) : (
                <div className="grid gap-4">
                  {visibleFiles.map((file) => (
                    <div
                      key={file.cid}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1 mb-4 sm:mb-0">
                        <File className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {formatBytes(file.size)} | Uploaded: {formatDate(file.uploadDate)}
                            {file.isArchived && ' | Archived'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <a
                          href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center w-full sm:w-auto"
                        >
                          <Button variant="outline" size="sm" className="w-full">
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Archived Files</h3>
              {uploadedFiles.filter(file => file.isArchived).length > 0 ? (
                <div className="grid gap-4">
                  {uploadedFiles.filter(file => file.isArchived).map((file) => (
                    <div
                      key={file.cid}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-100 rounded-lg"
                    >
                      <div className="flex items-center flex-1">
                        <File className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {formatBytes(file.size)} | Uploaded: {formatDate(file.uploadDate)} | Archived
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                <p className="text-gray-500 text-center py-4">
                  No files have been archived yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;