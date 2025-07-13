import React from "react";
import { FileText, File, Image, FileIcon } from "lucide-react";
import { DocumentFolder } from "../types/ClientTypes";

/**
 * Get icon component for file type
 */
export const getFileTypeIcon = (fileType: string): React.ReactNode => {
  if (fileType.includes('pdf')) {
    return React.createElement(FileText, { className: "w-5 h-5 text-red-500" });
  }
  if (fileType.includes('word') || fileType.includes('doc')) {
    return React.createElement(File, { className: "w-5 h-5 text-blue-500" });
  }
  if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) {
    return React.createElement(Image, { className: "w-5 h-5 text-green-500" });
  }
  return React.createElement(FileIcon, { className: "w-5 h-5 text-gray-500" });
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format upload date
 */
export const formatUploadDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Open document in new tab
 */
export const openDocumentInNewTab = (downloadURL: string): void => {
  window.open(downloadURL, '_blank');
};

/**
 * Download document
 */
export const downloadDocument = (downloadURL: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = downloadURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get folder display information
 */
export const getFolderInfo = (folder: DocumentFolder) => {
  const folderMap = {
    'client-forms': {
      name: 'Client Forms',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    'contracts-agreements': {
      name: 'Contracts & Agreements',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    'birth-planning': {
      name: 'Birth Planning',
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    'postpartum-support': {
      name: 'Postpartum Support',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    'educational-resources': {
      name: 'Educational Resources',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    }
  };
  
  return folderMap[folder];
};