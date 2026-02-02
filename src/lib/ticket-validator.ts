/**
 * Ticket validation utilities for Kerala lottery tickets
 */

export interface TicketValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Validates ticket format
 * Accepts: "RT 207473", "rt 207473", "207473"
 */
export function validateTicketFormat(ticket: string): TicketValidationResult {
  if (!ticket || !ticket.trim()) {
    return { valid: false, error: "Please enter your ticket number" };
  }

  const trimmed = ticket.trim().toUpperCase();

  // Pattern 1: Series + 6 digits (e.g., "RT 207473" or "RT207473")
  const fullPattern = /^[A-Z]{2}\s?\d{6}$/;

  // Pattern 2: Just 6 digits (for last-4 checks)
  const digitsPattern = /^\d{6}$/;

  if (fullPattern.test(trimmed)) {
    // Normalize to "XX XXXXXX" format
    const normalized = trimmed.replace(/^([A-Z]{2})\s?(\d{6})$/, "$1 $2");
    return { valid: true, normalized };
  }

  if (digitsPattern.test(trimmed)) {
    return { valid: true, normalized: trimmed };
  }

  return {
    valid: false,
    error: "Invalid format. Use format like 'RT 207473' or '207473'",
  };
}

/**
 * Normalizes ticket to consistent format
 */
export function normalizeTicket(ticket: string): string {
  const trimmed = ticket.trim().toUpperCase();

  // Add space between series and number if missing
  const normalized = trimmed.replace(/^([A-Z]{2})(\d{6})$/, "$1 $2");

  return normalized;
}

/**
 * Extracts last 4 digits from ticket number
 */
export function extractLast4Digits(ticket: string): string {
  const digits = ticket.replace(/\D/g, "");
  return digits.slice(-4);
}

/**
 * Extracts series from ticket (e.g., "RT" from "RT 207473")
 */
export function extractSeries(ticket: string): string | null {
  const match = ticket
    .trim()
    .toUpperCase()
    .match(/^([A-Z]{2})/);
  return match ? match[1] : null;
}

/**
 * Extracts full number from ticket (e.g., "207473" from "RT 207473")
 */
export function extractNumber(ticket: string): string {
  return ticket.replace(/\D/g, "");
}
