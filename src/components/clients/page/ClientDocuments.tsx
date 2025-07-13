import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Grid3X3, List } from "lucide-react";
import { ClientData, DocumentFolder } from "../types/ClientTypes";
import DocumentFolders from "./DocumentFolders";
import DocumentFolderView from "./DocumentFolderView";
import DocumentGroupedView from "./DocumentGroupedView";

interface ClientDocumentsProps {
  client: ClientData;
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'folders' | 'folder-contents' | 'grouped';

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

  const handleToggleGroupedView = () => {
    setCurrentView(currentView === 'grouped' ? 'folders' : 'grouped');
    setSelectedFolder(null);
  };

  const handleClose = () => {
    setCurrentView('folders');
    setSelectedFolder(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col p-0 overflow-hidden">&\
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b shrink-0">
          <div className="flex items-center gap-2">
            {(currentView === 'folder-contents' || currentView === 'grouped') && (
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
              {currentView === 'folders' ? 'Documents' : 
               currentView === 'grouped' ? 'All Documents' :
               selectedFolder ? 
                selectedFolder.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Documents'
              }
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            {currentView === 'folders' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleGroupedView}
                className="h-8 w-8 p-0"
                title="View all documents grouped by folder"
              >
                <List className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {currentView === 'folders' ? (
            <div>
              <div className="p-4 border-b">
                <Button 
                  onClick={handleToggleGroupedView}
                  variant="outline"
                  className="w-full"
                >
                  📂 View All Documents
                </Button>
              </div>
              <DocumentFolders
                client={client}
                onFolderSelect={handleFolderSelect}
              />
            </div>
          ) : currentView === 'grouped' ? (
            <DocumentGroupedView
              client={client}
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