import { useState } from 'react'
import { Button } from './ui/button'
import { Upload, Download, File } from 'lucide-react'
import lighthouse from '@lighthouse-web3/sdk'

interface FileItem {
  name: string
  size: number
  cid: string
}

// Replace with your Lighthouse API key
const LIGHTHOUSE_API_KEY = 'YOUR_API_KEY'

const FileManager = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Upload file to IPFS via Lighthouse
      const response = await lighthouse.upload(formData, LIGHTHOUSE_API_KEY)
      
      // Add the uploaded file to our list
      setUploadedFiles(prev => [...prev, {
        name: selectedFile.name,
        size: selectedFile.size,
        cid: response.data.Hash
      }])

      // Clear the selected file
      setSelectedFile(null)
      
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div id="file-manager" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">File Manager</h2>
          <p className="text-gray-600">
            Upload and manage your files securely on IPFS.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Select File
            </label>
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="inline-flex items-center"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            )}
          </div>
          {selectedFile && (
            <div className="mt-4 text-sm text-gray-500">
              Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
            </div>
          )}
        </div>

        {/* Files List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Files</h3>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
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
            ))}
            {uploadedFiles.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No files uploaded yet. Select a file to get started.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileManager
