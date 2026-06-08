import React from "react";
import { Search, LayoutGrid, List, X } from "lucide-react";
import type { SearchFilters } from "../../types";
import { useStore } from "../../store";
import { Button } from "../ui/Button";

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (f: Partial<SearchFilters>) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onNew: () => void;
}

export function SearchBar({
  filters,
  onChange,
  view,
  onViewChange,
  onNew,
}: SearchBarProps) {
  const { state } = useStore();
  const hasFilters =
    filters.category || filters.model || filters.tags.length > 0;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--text-primary)",
    padding: "8px 36px 8px 34px",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const selectStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    padding: "6px 10px",
    outline: "none",
    cursor: "pointer",
  };
  const optionStyle: React.CSSProperties = {
 backgroundColor: "var(--option-bg)",
  color: "var(--option-text)",  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search prompts..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
          {filters.query && (
            <button
              onClick={() => onChange({ query: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          {[
            { id: "grid" as const, Icon: LayoutGrid },
            { id: "list" as const, Icon: List },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className="p-1.5 rounded-md transition-colors"
              style={{
                backgroundColor:
                  view === id ? "var(--bg-hover)" : "transparent",
                color:
                  view === id ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>

        <Button onClick={onNew} size="sm">
          + New
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          style={selectStyle}
        >
          <option value="" style={optionStyle}>
            All Categories
          </option>
          {state.categories.map((c) => (
            <option key={c} value={c} style={optionStyle}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.model}
          onChange={(e) =>
            onChange({ model: e.target.value as SearchFilters["model"] })
          }
          style={selectStyle}
        >
          <option value="" style={optionStyle}>
            All Models
          </option>
          {[
            "ChatGPT",
            "Claude",
            "Gemini",
            "Cursor",
            "Perplexity",
            "DeepSeek",
            "Grok",
            "Custom",
          ].map((m) => (
            <option key={m} value={m} style={optionStyle}>
              {m}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => onChange({ category: "", model: "", tags: [] })}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
