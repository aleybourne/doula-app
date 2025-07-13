import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Upload, Eye, Download, Trash2 } from "lucide-react";
import { ClientData, DocumentFolder, Document } from "../types/ClientTypes";
import { 
  getFileTypeIcon, 
  formatFileSize, 
  formatUploadDate,
  openDocumentInNewTab,
  downloadDocument,
  getFolderInfo
} from "../utils/documentUtils";
import DocumentUpload from "./DocumentUpload";
import { useToast } from "@/hooks/use-toast";

interface DocumentFolderViewProps {
  client: ClientData;
  folder: DocumentFolder;
  onBack: () => void;
}

const DocumentFolderView: React.FC<DocumentFolderViewProps> = ({
  client,
  folder,
  onBack,
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();
  
  const folderInfo = getFolderInfo(folder);
  const documents = client.documents?.filter(doc => doc.folder === folder) || [];

  const handleViewDocument = (document: Document) => {
    openDocumentInNewTab(document.downloadURL);
  };

  const handleDownloadDocument = (document: Document) => {
    downloadDocument(document.downloadURL, document.fileName);
    toast({
      title: "Download started",
      description: `Downloading ${document.fileName}`,
    });
  };

  const handleDeleteDocument = (document: Document) => {
    // TODO: Implement delete functionality with client store
    toast({
      title: "Delete document",
      description: "Document deletion functionality will be implemented with client store integration",
    });
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    toast({
      title: "Upload successful",
      description: "Document has been uploaded successfully",
    });
  };

  if (showUpload) {
    return (
      <DocumentUpload
        client={client}
        folder={folder}
        onCancel={() => setShowUpload(false)}
        onComplete={handleUploadComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{folderInfo.name}</h2>
          <Button
            onClick={() => setShowUpload(true)}
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className={`p-4 rounded-full ${folderInfo.color} mb-4`}>
              <Upload className={`w-8 h-8 ${folderInfo.iconColor}`} />
            </div>
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first document to get started
            </p>
            <Button
              onClick={() => setShowUpload(true)}
              variant="outline"
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0">
                  {getFileTypeIcon(document.fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {document.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {document.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(document.fileSize)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatUploadDate(document.uploadDate)}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteDocument(document)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentFolderView;