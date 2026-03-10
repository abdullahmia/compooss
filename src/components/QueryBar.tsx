import { Play, RotateCcw, Braces, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface QueryBarProps {
  onRunQuery: (query: string) => void;
  fieldSuggestions?: string[];
}

export function QueryBar({ onRunQuery, fieldSuggestions = [] }: QueryBarProps) {
  const [query, setQuery] = useState('{ }');
  const [showOptions, setShowOptions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    // Parse current cursor context for field suggestions
    const cursorPos = inputRef.current?.selectionStart ?? value.length;
    const beforeCursor = value.slice(0, cursorPos);
    
    // Match partial field name after { or , 
    const fieldMatch = beforeCursor.match(/[{,]\s*"?(\w*)$/);
    if (fieldMatch && fieldMatch[1] && fieldSuggestions.length > 0) {
      const partial = fieldMatch[1].toLowerCase();
      const filtered = fieldSuggestions.filter(f => f.toLowerCase().includes(partial) && f.toLowerCase() !== partial);
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [fieldSuggestions]);

  const applySuggestion = (field: string) => {
    const cursorPos = inputRef.current?.selectionStart ?? query.length;
    const beforeCursor = query.slice(0, cursorPos);
    const afterCursor = query.slice(cursorPos);
    
    const replaced = beforeCursor.replace(/(\w*)$/, `${field}: `);
    setQuery(replaced + afterCursor);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (suggestions[selectedSuggestion]) {
          e.preventDefault();
          applySuggestion(suggestions[selectedSuggestion]);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    } else if (e.key === "Enter") {
      onRunQuery(query);
    }
  };

  return (
    <div className="border-b border-border bg-querybar">
      <div className="flex items-center gap-2 px-4 py-2">
        <Braces className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground font-medium shrink-0">FILTER</span>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="w-full bg-secondary text-xs font-mono text-foreground px-3 py-1.5 rounded border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
            placeholder='{ field: "value" }'
          />
          {/* Field suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded shadow-lg z-50 py-1 max-h-48 overflow-y-auto scrollbar-thin">
              {suggestions.map((field, i) => (
                <button
                  key={field}
                  onMouseDown={(e) => { e.preventDefault(); applySuggestion(field); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center gap-2 transition-colors ${
                    i === selectedSuggestion
                      ? "bg-primary/15 text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="text-json-key">{field}</span>
                  <span className="text-muted-foreground text-[10px] ml-auto">field</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`p-1.5 rounded transition-colors ${showOptions ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setQuery('{ }')}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onRunQuery(query)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Play className="h-3 w-3" />
          Find
        </button>
      </div>

      {showOptions && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Project:</span>
            <input
              type="text"
              defaultValue="{ }"
              className="bg-secondary text-foreground font-mono px-2 py-1 rounded border border-border w-32 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort:</span>
            <input
              type="text"
              defaultValue="{ }"
              className="bg-secondary text-foreground font-mono px-2 py-1 rounded border border-border w-32 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Limit:</span>
            <input
              type="text"
              defaultValue="20"
              className="bg-secondary text-foreground font-mono px-2 py-1 rounded border border-border w-16 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Skip:</span>
            <input
              type="text"
              defaultValue="0"
              className="bg-secondary text-foreground font-mono px-2 py-1 rounded border border-border w-16 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
