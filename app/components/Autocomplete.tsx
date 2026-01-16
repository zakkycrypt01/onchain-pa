import React, { useMemo } from "react";
import { COMMAND_SHORTCUTS } from "@/app/api/agent/command-shortcuts";

interface AutocompleteProps {
  input: string;
  onSelect: (suggestion: string) => void;
  isOpen: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ input, onSelect, isOpen }) => {
  const suggestions = useMemo(() => {
    if (!input.trim() || !isOpen) return [];

    const inputLower = input.toLowerCase();
    const allSuggestions = COMMAND_SHORTCUTS.flatMap((shortcut) =>
      shortcut.aliases.map((alias) => ({
        alias,
        command: shortcut.command,
        description: shortcut.description,
      }))
    );

    return allSuggestions
      .filter(
        (item) =>
          item.alias.startsWith(inputLower) ||
          item.command.toLowerCase().includes(inputLower)
      )
      .slice(0, 5);
  }, [input, isOpen]);

  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-16 left-0 right-0 bg-gray-800 border border-cyan-500/50 rounded max-h-40 overflow-y-auto z-40">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-cyan-500/20 cursor-pointer border-b border-gray-700 last:border-b-0"
          onClick={() => onSelect(suggestion.alias)}
        >
          <div className="text-cyan-400 text-sm font-mono">{suggestion.alias}</div>
          <div className="text-gray-400 text-xs">{suggestion.description}</div>
        </div>
      ))}
    </div>
  );
};

export default Autocomplete;
