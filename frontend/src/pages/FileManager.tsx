import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Upload, Download, File, EyeOff, Archive } from 'lucide-react';
import lighthouse from '@lighthouse-web3/sdk';
import AiChat from '../components/AiChat';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contractAbiJson from '../../contracts/abi.json';
import { config } from '../config/wagmi';

const contractAbi = contractAbiJson;

const contractAddress = '0xABc700e3EE92Ee98D984527ecfD82884Dcc9De8d';

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
  const [cidToRegister, setCidToRegister] = useState<string | null>(null);
  const [fileTypeToRegister, setFileTypeToRegister] = useState<string | null>(null);
  const [encryptedKeyToRegister, setEncryptedKeyToRegister] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address: userAddress } = useAccount();

  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles");
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
          ...file,
          uploadDate: file.uploadDate ? new Date(file.uploadDate) : new Date(),
        }));
        setUploadedFiles(parsedFiles);
      } catch (e) {
        console.error("Failed to parse files from localStorage:", e);
        localStorage.removeItem("uploadedFiles");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const {
    writeContract: registerFile,
    data: writeData,
    isPending: isContractWriteLoading,
    error: writeError,
    isError: isWriteError
  } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    error: txError,
    isError: isTxError
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  useEffect(() => {
    if (writeData) {
      setTxHash(writeData);
    }

    if (isTxSuccess && writeData) {
      console.log('Transaction successful');
      setCidToRegister(null);
      setFileTypeToRegister(null);
      setEncryptedKeyToRegister(null);
      setIsRegistering(false);
      setRegisterError(null);
    }
  }, [isTxSuccess, writeData]);

  useEffect(() => {
    if (isTxError && txError) {
      console.error('Transaction error:', txError);
      let userMessage = `Transaction failed: ${txError.message}`;

      if (txError.message.includes("No active subscription")) {
        userMessage = "Upload failed: No active subscription found. Please purchase a subscription.";
      } else if (txError.message.includes("Internal JSON-RPC error")) {
        userMessage = "Transaction failed: Internal JSON-RPC error. Possible issue with the network node or the smart contract execution.";
      } else if (txError.message.includes("insufficient funds")) {
        userMessage = "Transaction failed: Insufficient funds for gas.";
      }
      // Add more specific checks here if needed

      setRegisterError(userMessage);
      setIsRegistering(false);
    }
  }, [isTxError, txError]);

  useEffect(() => {
    setIsRegistering(isContractWriteLoading || isTxLoading);
  }, [isContractWriteLoading, isTxLoading]);

  useEffect(() => {
    if (isWriteError && writeError) {
      console.error("Contract Write Error:", writeError);
      let userMessage = `Contract Error: ${writeError.message}`;

      if (writeError.message.includes("No active subscription")) {
        userMessage = "Upload failed: No active subscription found. Please purchase a subscription.";
      } else if (writeError.message.includes("Internal JSON-RPC error")) {
        userMessage = "Contract Error: Internal JSON-RPC error. Possible issue with the network node or the smart contract simulation.";
      } else if (writeError.message.includes("insufficient funds")) {
        userMessage = "Contract Error: Insufficient funds.";
      }
      // Add more specific checks here if needed

      setRegisterError(userMessage);
      setIsRegistering(false);
      // Reset state if write fails
      setCidToRegister(null);
      setFileTypeToRegister(null);
      setEncryptedKeyToRegister(null);
    }
  }, [isWriteError, writeError]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setRegisterError(null);
      setTxHash(null);
      setCidToRegister(null);
      setFileTypeToRegister(null);
      setEncryptedKeyToRegister(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    if (!userAddress) {
      setError("Please connect your wallet.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setRegisterError(null);
    setTxHash(null);

    const generatedKey = Math.random().toString(36).substring(2);

    try {
      const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        throw new Error("Lighthouse API key needs to be set in .env file");
      }
      if (!selectedFile) {
        throw new Error("No file selected for upload");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Starting direct upload via fetch API...");
      console.log("Uploading file:", selectedFile.name, "Size:", selectedFile.size);
      setUploadProgress(10); // Initial progress indication

      // --- Direct Fetch Upload Logic --- 
      const url = `https://node.lighthouse.storage/api/v0/add`;
      const fetchResponse = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
      });

      // Simulate intermediate progress 
      setUploadProgress(70);

      if (!fetchResponse.ok) {
        const errorBody = await fetchResponse.text();
        throw new Error(`Lighthouse API error: ${fetchResponse.status} ${fetchResponse.statusText}. Body: ${errorBody}`);
      }

      const data = await fetchResponse.json();
      console.log("Direct upload response:", data);

      if (!data || !data.Hash) {
        throw new Error("Invalid response from direct upload: Missing Hash");
      }

      const finalCid = data.Hash;
      const finalFileType = selectedFile.type || "application/octet-stream";
      console.log("File uploaded successfully via Fetch with CID:", finalCid);

      // --- Upload Succeeded --- 
      setUploadProgress(100);
      setIsUploading(false);

      const newFile: FileItem = {
        name: selectedFile.name,
        size: selectedFile.size,
        cid: finalCid,
        uploadDate: new Date(),
        isHidden: false,
        isArchived: false,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      const currentSelectedFile = selectedFile; // Capture file before setting to null
      setSelectedFile(null);

      console.log("IPFS upload successful! Preparing blockchain registration...");

      // Set states for blockchain registration
      setCidToRegister(finalCid);
      setFileTypeToRegister(finalFileType);
      setEncryptedKeyToRegister(generatedKey);
      setRegisterError(null);

      // --- Re-enable Blockchain Registration --- 
      console.log("Attempting to register file on blockchain...");
      setTimeout(() => {
        try {
          if (finalCid && finalFileType && generatedKey) {
            console.log("Registering with:", { cid: finalCid, type: finalFileType, key: generatedKey.substring(0, 5) + "..." });
            registerFile({
              address: contractAddress,
              abi: contractAbi,
              functionName: 'uploadFile',
              args: [
                finalCid,
                finalFileType,
                BigInt(2592000),
                false,
                generatedKey,
              ],
              gas: 2000000n,
            });
          } else {
            const errorMsg = "Missing data for blockchain registration";
            setRegisterError(errorMsg);
            console.error(errorMsg, { finalCid, finalFileType, generatedKey });
          }
        } catch (regError: any) {
          const errorMsg = `Failed to initiate blockchain registration: ${regError.message}`;
          console.error(errorMsg, regError);
          setRegisterError(errorMsg);
          setIsRegistering(false);
        }
      }, 500); // Delay before registration call

    } catch (err: any) {
      console.error("Overall upload process error:", err);
      console.error("Error stack:", err.stack);
      setError(`Upload failed: ${err.message}`);
      setIsUploading(false);
      setIsRegistering(false);
      setUploadProgress(0);
      // Reset potentially set registration states
      setCidToRegister(null);
      setFileTypeToRegister(null);
      setEncryptedKeyToRegister(null);
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
        <div className="bg-card rounded-lg shadow-sm p-6 lg:p-8 border border-border">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              File Manager
            </h1>
            <p className="text-muted-foreground">
              Upload and manage your files securely on the decentralized web.
              Record your uploads on the blockchain.
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
                disabled={!selectedFile || isUploading || isRegistering}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading to IPFS..." : isRegistering ? "Registering on Chain..." : "Upload & Register"}
              </Button>
            </div>

            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            {registerError && <p className="text-destructive text-sm mt-2">{registerError}</p>}
            {isTxSuccess && txHash && (
              <p className="text-green-600 text-sm mt-2">
                Successfully registered file on chain! Tx: <a href={`https://calibration.filscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)}</a>
              </p>
            )}

            {(isUploading || (isRegistering && !isTxLoading && !isTxSuccess && !registerError)) && (
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className={`bg-primary h-2 rounded-full transition-all duration-300 ${isUploading ? '' : 'animate-pulse'}`}
                  style={{ width: `${isUploading ? uploadProgress : 100}%` }}
                />
              </div>
            )}

            {isRegistering && (
              <p className="text-sm text-muted-foreground mt-1">
                {isContractWriteLoading ? 'Preparing transaction...' : isTxLoading ? 'Waiting for confirmation...' : 'Processing...'}
              </p>
            )}
          </div>
        </div>

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
                            CID: {file.cid.substring(0, 6)}...{file.cid.substring(file.cid.length - 4)} | Size: {formatBytes(file.size)} | Added:{" "}
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
