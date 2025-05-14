import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tag } from "./clientsTagsData";

// Color mapping for selecting
const TAG_COLORS = {
  green: "bg-[#F2FCE2] text-[#3B7567]",
  orange: "bg-[#FEC6A1] text-[#987242]",
  purple: "bg-[#E5DEFF] text-[#624B8A]",
  blue: "bg-[#D3E4FD] text-[#4A6FA5]",
  yellow: "bg-[#FEF7CD] text-[#937E24]",
};
type TagColor = keyof typeof TAG_COLORS;

interface Category {
  key: string;
  label: string;
  color: TagColor;
}

const CATEGORIES: Category[] = [
  { key: "common", label: "Things in Common", color: "green" },
  { key: "personal", label: "Personal", color: "orange" },
  { key: "medical", label: "Medical", color: "purple" },
  { key: "preferences", label: "Preferences", color: "blue" },
  { key: "notes", label: "Notes", color: "yellow" },
];

interface TagsData {
  [categoryKey: string]: {
    label: string;
    color: TagColor;
  }[];
}

// Dialog for entering custom tag
const AddTagInputDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (label: string) => void;
  category: Category | null;
}> = ({ open, onClose, onAdd, category }) => {
  const [label, setLabel] = useState('');
  React.useEffect(() => {
    if (open) setLabel('');
  }, [open]);
  if (!open || !category) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/10 flex items-start justify-center pt-[17vh]">
      <div className="bg-white rounded-2xl shadow-lg border px-6 py-5 min-w-[290px] flex flex-col gap-2 animate-in fade-in-0">
        <div className="mb-2">
          <span className="font-semibold"
                style={{ color: TAG_COLORS[category.color].split(' ')[1].replace('text-', '').replace(']', '') }}>
            Add Tag to {category.label}
          </span>
        </div>
        <input
          className="border rounded-md px-2 py-2 text-md w-full"
          placeholder="Tag label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          autoFocus
        />
        <div className="flex gap-1 mt-2">
          <button
            className="bg-[#BEE6F5] hover:bg-[#D3E4FD] rounded-md px-3 py-1 font-medium text-xs text-[#405] mr-1"
            onClick={() => {
              if (label.trim()) {
                onAdd(label.trim());
                setLabel('');
                onClose();
              }
            }}
            type="button"
          >
            Add
          </button>
          <button
            className="rounded-md px-3 py-1 text-xs text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface ClientTagsSectionProps {
  initialTags: Tag[] | TagsData;
  bgColor?: string;
}

const ClientTagsSection: React.FC<ClientTagsSectionProps> = ({ initialTags, bgColor = "bg-[#f9f5f2]" }) => {
  const [allTags, setAllTags] = useState<TagsData>(() => {
    if (Array.isArray(initialTags)) {
      const organizedTags: TagsData = {};
      initialTags.forEach(tag => {
        const colorMatch = tag.color.match(/bg-\[(#[A-Fa-f0-9]+)\]/);
        let tagColor: TagColor = 'purple';
        
        if (colorMatch && colorMatch[1]) {
          const hexColor = colorMatch[1].toLowerCase();
          if (hexColor === '#f2fce2' || hexColor === '#a7ebb1') tagColor = 'green';
          else if (hexColor === '#fec6a1' || hexColor === '#f499b7') tagColor = 'orange';
          else if (hexColor === '#e5deff' || hexColor === '#a085e9') tagColor = 'purple';
          else if (hexColor === '#d3e4fd' || hexColor === '#82a7e2') tagColor = 'blue';
          else if (hexColor === '#fef7cd') tagColor = 'yellow';
        }
        
        let categoryKey = 'common';
        if (tag.description && tag.description.toLowerCase().includes('payment')) {
          categoryKey = 'personal';
        } else if (tag.description && tag.description.toLowerCase().includes('birth')) {
          categoryKey = 'medical';
        } else if (tag.description && tag.description.toLowerCase().includes('consult')) {
          categoryKey = 'preferences';
        }
        
        if (!organizedTags[categoryKey]) {
          organizedTags[categoryKey] = [];
        }
        
        organizedTags[categoryKey].push({
          label: tag.label,
          color: tagColor
        });
      });
      return organizedTags;
    }
    return initialTags as TagsData;
  });
  
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

  const handleDropdownSelect = (categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    setDialogOpen(true);
    setAddMenuOpen(false);
  };
  
  const handleAddTag = (label: string) => {
    if (!selectedCategoryKey) return;
    const catObj = CATEGORIES.find(cat => cat.key === selectedCategoryKey);
    if (!catObj) return;
    setAllTags(prev => ({
      ...prev,
      [selectedCategoryKey]: [
        ...prev[selectedCategoryKey] || [],
        { label, color: catObj.color }
      ]
    }));
    setSelectedCategoryKey(null);
  };
  
  const handleDeleteTag = (categoryKey: string, tagIdx: number) => {
    setAllTags(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter((_, idx) => idx !== tagIdx)
    }));
  };
  
  const selectedCategory =
    selectedCategoryKey ? CATEGORIES.find(cat => cat.key === selectedCategoryKey) || null : null;

  return (
    <div className="w-full py-2">
      <div className="flex flex-col gap-2 mb-2 pl-2 pr-4">
        {CATEGORIES.map(category => (
          <div key={category.key} className="flex flex-col gap-1">
            {allTags[category.key] && allTags[category.key].length > 0 && (
              <>
                <div className="text-xs font-semibold text-gray-500 mb-0.5">
                  {category.label}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {allTags[category.key].map((tag, idx) => (
                    <span
                      key={idx}
                      className={`relative group inline-block px-2 py-1 rounded-lg text-xs font-medium border ${TAG_COLORS[tag.color]} border-opacity-10 transition`}
                    >
                      {tag.label}
                      <button
                        type="button"
                        aria-label="Delete tag"
                        onClick={() => handleDeleteTag(category.key, idx)}
                        className="absolute top-0 right-0 p-0.5 rounded-full text-[#8E9196] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#eee] hover:text-[#ea384c] focus:opacity-100"
                        tabIndex={-1}
                        style={{
                          transform: "translate(50%,-50%)",
                        }}
                      >
                        <X size={14} strokeWidth={2.4} />
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end pr-4">
        <DropdownMenu open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex gap-1 items-center px-3 py-1 rounded-full shadow border border-gray-300 hover:border-gray-400 transition text-sm font-medium bg-[#f9f5f2]"
              aria-label="Add tag"
              type="button"
            >
              <Plus size={18} className="mr-1" /> Add Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="z-[70] bg-white min-w-[170px]">
            {CATEGORIES.map(cat => (
              <DropdownMenuItem
                key={cat.key}
                onClick={() => handleDropdownSelect(cat.key)}
                className={`${TAG_COLORS[cat.color]} font-semibold cursor-pointer`}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddTagInputDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedCategoryKey(null); }}
        onAdd={handleAddTag}
        category={selectedCategory}
      />
    </div>
  );
};

export default ClientTagsSection;
