/**
 * Accessibility Utilities
 * Functions to improve accessibility and WCAG compliance
 */

export function generateAriaLabel(command: string, status: string): string {
  return `${status} command: ${command}`;
}

export function generateAriaDescribedBy(commandId: string): string {
  return `${commandId}-details`;
}

export const A11Y_MESSAGES = {
  COMMAND_EXECUTED: "Command executed successfully",
  COMMAND_FAILED: "Command failed",
  COMMAND_EXECUTING: "Command is executing",
  HISTORY_CLEARED: "Command history has been cleared",
  FAVORITE_ADDED: "Favorite has been added",
  FAVORITE_REMOVED: "Favorite has been removed",
  SETTINGS_SAVED: "Settings have been saved",
  CLIPBOARD_COPIED: "Command copied to clipboard",
};

export const KEYBOARD_HANDLERS = {
  Enter: "submit",
  Tab: "autocomplete",
  Escape: "cancel",
  ArrowUp: "history-previous",
  ArrowDown: "history-next",
  "Ctrl+L": "clear-screen",
  "Ctrl+C": "cancel-command",
  "Ctrl+K": "search-history",
};

export function announceToScreenReader(message: string) {
  const ariaLive = document.createElement("div");
  ariaLive.setAttribute("role", "status");
  ariaLive.setAttribute("aria-live", "polite");
  ariaLive.setAttribute("aria-atomic", "true");
  ariaLive.className = "sr-only";
  ariaLive.textContent = message;
  document.body.appendChild(ariaLive);

  setTimeout(() => {
    document.body.removeChild(ariaLive);
  }, 1000);
}

export function createAccessibleButton(label: string, onClick: () => void) {
  const button = document.createElement("button");
  button.setAttribute("aria-label", label);
  button.setAttribute("type", "button");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

export const FOCUSABLE_ELEMENTS = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
  return container.querySelector(FOCUSABLE_ELEMENTS) as HTMLElement;
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  if (event.key !== "Tab") return;

  const focusableElements = Array.from(
    container.querySelectorAll(FOCUSABLE_ELEMENTS)
  ) as HTMLElement[];

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey) {
    if (activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}
