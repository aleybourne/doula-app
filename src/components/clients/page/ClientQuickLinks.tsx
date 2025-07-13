
import React from "react";
import { FileText, Receipt, BookOpen, Book } from "lucide-react";
import { ClientData } from "../types/ClientTypes";

interface QuickLink {
  label: string;
  icon: JSX.Element;
  bg: string;
  aria: string;
  to: string;
}

interface ClientQuickLinksProps {
  client?: ClientData;
  onJournalClick?: () => void;
  onDocumentsClick?: () => void;
}

const quickLinks: QuickLink[] = [
  {
    label: "Documents",
    icon: <FileText className="w-8 h-8 text-[#7E69AB]" />,
    bg: "bg-[#f9f5f2]",
    aria: "Go to Documents",
    to: "#documents"
  },
  {
    label: "Payments",
    icon: <Receipt className="w-8 h-8 text-[#F499B7]" />,
    bg: "bg-[#f9f5f2]",
    aria: "Go to Payments",
    to: "#payments"
  },
  {
    label: "Education",
    icon: <BookOpen className="w-8 h-8 text-[#82A7E2]" />,
    bg: "bg-[#f9f5f2]",
    aria: "Go to Education",
    to: "#education"
  },
  {
    label: "Journal",
    icon: <Book className="w-8 h-8 text-[#A085E9]" />,
    bg: "bg-[#f9f5f2]",
    aria: "Go to Journal",
    to: "#journal"
  },
];

const ClientQuickLinks: React.FC<ClientQuickLinksProps> = ({ client, onJournalClick, onDocumentsClick }) => {
  const handleQuickLink = (to: string, label: string) => {
    if (label === "Journal" && onJournalClick) {
      onJournalClick();
    } else if (label === "Documents" && onDocumentsClick) {
      onDocumentsClick();
    } else {
      console.log(`Quick link clicked: ${label}`);
    }
  };

  return (
    <div className="flex justify-between gap-1 px-3 mt-4 mb-1">
      {quickLinks.map(q => (
        <button
          key={q.label}
          aria-label={q.aria}
          className="flex flex-col items-center bg-transparent px-[5px] py-0 flex-1 group"
          tabIndex={0}
          onClick={() => handleQuickLink(q.to, q.label)}
          type="button"
        >
          <span
            className="w-16 h-10 rounded-full flex justify-center items-center mb-1 transition bg-[#f9f5f2] border border-transparent group-hover:shadow-md"
            style={{ minWidth: 64, minHeight: 40 }}
          >
            {q.icon}
          </span>
          <span className="text-xs mt-0.5 font-medium text-[#37384A]">{q.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ClientQuickLinks;
