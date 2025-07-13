import React from "react";
import { ClientData, Document } from "../types/ClientTypes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Eye, Trash2 } from "lucide-react";
import { getFileTypeIcon, formatFileSize, getFolderInfo } from "../utils/documentUtils";
import { FolderOpen } from "lucide-react";
import { deleteClientDocument } from "../utils/firebaseStorage";
import { updateClient } from "../store/clientActions";
import { useToast } from "@/hooks/use-toast";

interface DocumentGroupedViewProps {
  client: ClientData;
}

const DocumentGroupedView: React.FC<DocumentGroupedViewProps> = ({ client }) => {
  const { toast } = useToast();

  // Group documents by folder
  const documentsByFolder = (client.documents || []).reduce((acc, doc) => {
    const folderName = doc.folder || "Uncategorized";
    if (!acc[folderName]) acc[folderName] = [];
    acc[folderName].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const handleViewDocument = (document: Document) => {
    window.open(document.downloadURL, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadDocument = (doc: Document) => {
    const link = window.document.createElement('a');
    link.href = doc.downloadURL;
    link.download = doc.fileName || doc.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `${doc.name} is being downloaded`,
    });
  };

  const handleDeleteDocument = async (document: Document) => {
    try {
      // Delete from Firebase Storage
      await deleteClientDocument(document.storagePath);
      
      // Remove from client's documents array
      const updatedDocuments = client.documents?.filter(doc => doc.id !== document.id) || [];
      const updatedClient = {
        ...client,
        documents: updatedDocuments
      };
      
      await updateClient(updatedClient);
      
      toast({
        title: "Document deleted",
        description: `${document.name} has been deleted successfully`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFolderName = (folder: string) => {
    return folder.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!client.documents || client.documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
        <p className="text-sm text-muted-foreground">Documents will appear here once uploaded</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {Object.entries(documentsByFolder).map(([folder, docs]) => {
        const folderInfo = getFolderInfo(folder as any);
        
        return (
          <div key={folder} className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{formatFolderName(folder)}</h3>
              <span className="text-sm text-muted-foreground">({docs.length})</span>
            </div>
            
            <div className="space-y-2">
              {docs.map((document) => {
                return (
                  <Card key={document.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 text-primary shrink-0">
                          {getFileTypeIcon(document.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{document.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{document.fileType.toUpperCase()}</span>
                            <span>•</span>
                            <span>{formatFileSize(document.fileSize)}</span>
                            <span>•</span>
                            <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDocument(document)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentGroupedView;