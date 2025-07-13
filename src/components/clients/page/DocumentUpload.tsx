import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileIcon, AlertCircle } from "lucide-react";
import { ClientData, DocumentFolder, Document } from "../types/ClientTypes";
import { validateDocumentFile, uploadClientDocument } from "../utils/firebaseStorage";
import { getFileTypeIcon, formatFileSize } from "../utils/documentUtils";
import { updateClient } from "../store/clientActions";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploadProps {
  client: ClientData;
  folder: DocumentFolder;
  onCancel: () => void;
  onComplete: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  client,
  folder,
  onCancel,
  onComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    const validationError = validateDocumentFile(file);
    if (validationError) {
      setValidationError(validationError);
      setSelectedFile(null);
      setDocumentName("");
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
    setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and provide a document name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Start progress indicator
      setUploadProgress(10);

      // Upload to Firebase Storage
      const uploadResult = await uploadClientDocument(selectedFile, client.id, folder);
      setUploadProgress(70);

      // Create document object
      const newDocument: Document = {
        id: uuidv4(),
        name: documentName,
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
        uploadDate: new Date().toISOString(),
        folder: folder,
        storagePath: uploadResult.path,
        downloadURL: uploadResult.url
      };

      setUploadProgress(90);

      // Update client with new document
      const updatedDocuments = [...(client.documents || []), newDocument];
      const updatedClient = {
        ...client,
        documents: updatedDocuments
      };

      await updateClient(updatedClient);
      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: `${documentName} has been uploaded successfully`,
      });
      
      onComplete();

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upload Document</h3>
        
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : validationError
              ? "border-destructive bg-destructive/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                {getFileTypeIcon(selectedFile.type)}
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setDocumentName("");
                  setValidationError(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 text-muted-foreground">
                <Upload className="w-full h-full" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your file here, or{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {validationError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {validationError}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Document Name */}
        {selectedFile && (
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter a descriptive name for this document"
              disabled={isUploading}
            />
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !documentName.trim() || isUploading}
          className="flex-1"
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;