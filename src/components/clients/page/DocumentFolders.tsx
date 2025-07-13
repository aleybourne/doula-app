import React from "react";
import { FileText, File, Heart, Baby, BookOpen } from "lucide-react";
import { ClientData, DocumentFolder } from "../types/ClientTypes";
import { getFolderInfo } from "../utils/documentUtils";

interface DocumentFoldersProps {
  client: ClientData;
  onFolderSelect: (folder: DocumentFolder) => void;
}

const folderConfig = [
  {
    id: 'client-forms' as DocumentFolder,
    icon: FileText,
    name: 'Client Forms',
    description: 'Intake forms, questionnaires, and assessments'
  },
  {
    id: 'contracts-agreements' as DocumentFolder,
    icon: File,
    name: 'Contracts & Agreements',
    description: 'Service contracts, consent forms, and agreements'
  },
  {
    id: 'birth-planning' as DocumentFolder,
    icon: Heart,
    name: 'Birth Planning',
    description: 'Birth plans, preferences, and preparation documents'
  },
  {
    id: 'postpartum-support' as DocumentFolder,
    icon: Baby,
    name: 'Postpartum Support',
    description: 'Recovery plans, resources, and follow-up materials'
  },
  {
    id: 'educational-resources' as DocumentFolder,
    icon: BookOpen,
    name: 'Educational Resources',
    description: 'Guides, articles, and educational materials'
  }
];

const DocumentFolders: React.FC<DocumentFoldersProps> = ({
  client,
  onFolderSelect,
}) => {
  const getDocumentCount = (folder: DocumentFolder): number => {
    if (!client.documents) return 0;
    return client.documents.filter(doc => doc.folder === folder).length;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-3">
        <div className="text-sm text-muted-foreground mb-4">
          Organize and manage important documents for {client.name}
        </div>
        
        <div className="space-y-3">
          {folderConfig.map((folder) => {
            const Icon = folder.icon;
            const folderInfo = getFolderInfo(folder.id);
            const documentCount = getDocumentCount(folder.id);
            
            return (
              <button
                key={folder.id}
                onClick={() => onFolderSelect(folder.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${folderInfo.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white ${folderInfo.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {folder.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {documentCount} {documentCount === 1 ? 'document' : 'documents'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentFolders;