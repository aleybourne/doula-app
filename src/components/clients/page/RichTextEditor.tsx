import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import FormattingToolbar from "./FormattingToolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note...",
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Track selection changes to update active formats
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
      if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
    } catch (error) {
      // Ignore errors from queryCommandState
    }
    
    setActiveFormats(formats);
  }, []);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      
      // Add to history for undo/redo
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(content);
        return newHistory.slice(-50); // Keep last 50 changes
      });
      setHistoryIndex(prev => prev + 1);
    }
  }, [onChange, historyIndex]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            handleFormat('redo');
          } else {
            e.preventDefault();
            handleFormat('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          handleFormat('redo');
          break;
      }
    }
  }, []);

  // Format text
  const handleFormat = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    try {
      if (command === 'undo' && historyIndex > 0) {
        const prevContent = history[historyIndex - 1];
        editorRef.current.innerHTML = prevContent;
        onChange(prevContent);
        setHistoryIndex(prev => prev - 1);
        return;
      }

      if (command === 'redo' && historyIndex < history.length - 1) {
        const nextContent = history[historyIndex + 1];
        editorRef.current.innerHTML = nextContent;
        onChange(nextContent);
        setHistoryIndex(prev => prev + 1);
        return;
      }

      // Execute formatting command
      document.execCommand(command, false, value);
      
      // Update content
      const content = editorRef.current.innerHTML;
      onChange(content);
      
      // Update active formats
      setTimeout(updateActiveFormats, 10);
    } catch (error) {
      console.warn("Format command failed:", command, error);
    }
  }, [onChange, history, historyIndex, updateActiveFormats]);

  // Insert timestamp
  const handleInsertTimestamp = useCallback(() => {
    if (!editorRef.current) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    editorRef.current.focus();
    
    try {
      // Insert timestamp with formatting
      const timestamp = `<strong>${timeString} - </strong>`;
      document.execCommand('insertHTML', false, timestamp);
      
      const content = editorRef.current.innerHTML;
      onChange(content);
    } catch (error) {
      // Fallback for browsers that don't support insertHTML
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const timestampNode = document.createElement('strong');
        timestampNode.textContent = `${timeString} - `;
        range.insertNode(timestampNode);
        
        // Move cursor after timestamp
        range.setStartAfter(timestampNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        const content = editorRef.current.innerHTML;
        onChange(content);
      }
    }
  }, [onChange]);

  // Handle selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveFormats]);

  // Convert plain text to HTML if needed
  const displayContent = value && !value.includes('<') ? 
    value.replace(/\n/g, '<br>') : value;

  return (
    <div className="flex flex-col h-full">
      <FormattingToolbar
        onFormat={handleFormat}
        activeFormats={activeFormats}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onInsertTimestamp={handleInsertTimestamp}
      />
      
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        className={cn(
          "flex-1 p-4 mt-2 min-h-[400px] border-none outline-none text-base leading-relaxed",
          "focus:ring-0 focus:border-none",
          !value && "before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none",
          className
        )}
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={updateActiveFormats}
        suppressContentEditableWarning={true}
        style={{ 
          whiteSpace: 'pre-wrap',
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'bidi-override',
          writingMode: 'horizontal-tb'
        }}
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </div>
  );
};

export default RichTextEditor;