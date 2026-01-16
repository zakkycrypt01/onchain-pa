/**
 * Keyboard Handling Utilities
 * Centralized keyboard event management
 */

export interface KeyBinding {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: () => void;
  description: string;
}

export class KeyboardManager {
  private bindings: KeyBinding[] = [];

  register(binding: KeyBinding) {
    this.bindings.push(binding);
  }

  unregister(key: string) {
    this.bindings = this.bindings.filter((b) => b.key !== key);
  }

  handle(event: KeyboardEvent): boolean {
    for (const binding of this.bindings) {
      if (
        event.key === binding.key &&
        event.ctrlKey === (binding.ctrlKey || false) &&
        event.shiftKey === (binding.shiftKey || false) &&
        event.altKey === (binding.altKey || false) &&
        event.metaKey === (binding.metaKey || false)
      ) {
        event.preventDefault();
        binding.handler();
        return true;
      }
    }
    return false;
  }

  getBindings(): KeyBinding[] {
    return [...this.bindings];
  }

  clear() {
    this.bindings = [];
  }
}

export function getKeyName(event: KeyboardEvent): string {
  const modifiers: string[] = [];

  if (event.ctrlKey) modifiers.push("Ctrl");
  if (event.shiftKey) modifiers.push("Shift");
  if (event.altKey) modifiers.push("Alt");
  if (event.metaKey) modifiers.push("Meta");

  modifiers.push(event.key);
  return modifiers.join("+");
}

export function normalizeKeySequence(sequence: string): Partial<KeyboardEvent> {
  const parts = sequence.split("+").map((p) => p.trim());
  const result: any = {};

  for (const part of parts) {
    switch (part.toLowerCase()) {
      case "ctrl":
        result.ctrlKey = true;
        break;
      case "shift":
        result.shiftKey = true;
        break;
      case "alt":
        result.altKey = true;
        break;
      case "meta":
        result.metaKey = true;
        break;
      default:
        result.key = part;
    }
  }

  return result;
}

export const DEFAULT_BINDINGS: KeyBinding[] = [
  {
    key: "l",
    ctrlKey: true,
    handler: () => console.log("Clear screen"),
    description: "Clear screen",
  },
  {
    key: "c",
    ctrlKey: true,
    handler: () => console.log("Cancel command"),
    description: "Cancel current command",
  },
  {
    key: "k",
    ctrlKey: true,
    handler: () => console.log("Search history"),
    description: "Search command history",
  },
];
