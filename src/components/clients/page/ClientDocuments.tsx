import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { ClientData, DocumentFolder } from "../types/ClientTypes";
import DocumentFolders from "./DocumentFolders";
import DocumentFolderView from "./DocumentFolderView";

interface ClientDocumentsProps {
  client: ClientData;
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'folders' | 'folder-contents';

const ClientDocuments: React.FC<ClientDocumentsProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('folders');
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);

  const handleFolderSelect = (folder: DocumentFolder) => {
    setSelectedFolder(folder);
    setCurrentView('folder-contents');
  };

  const handleBackToFolders = () => {
    setCurrentView('folders');
    setSelectedFolder(null);
  };

  const handleClose = () => {
    setCurrentView('folders');
    setSelectedFolder(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            {currentView === 'folder-contents' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToFolders}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg font-semibold">
              {currentView === 'folders' ? 'Documents' : selectedFolder ? 
                selectedFolder.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Documents'
              }
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentView === 'folders' ? (
            <DocumentFolders
              client={client}
              onFolderSelect={handleFolderSelect}
            />
          ) : selectedFolder ? (
            <DocumentFolderView
              client={client}
              folder={selectedFolder}
              onBack={handleBackToFolders}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDocuments;