export const PATTERNS = {
  // Matches "1st Prize Rs :100000/-" or similar variations
  PRIZE_HEADER:
    /(\d+)(?:st|nd|rd|th)\s+Prize[\s-]*(?:Rs)?\s*[:.]?\s*(\d+(?:,\d+)*)\/?-?/i,
  CONSOLATION_PRIZE_HEADER:
    /Cons(?:olation)?\s+Prize[\s-]*(?:Rs)?\s*[:.]?\s*(\d+(?:,\d+)*)\/?-?/i,

  // Header info
  LOTTERY_NAME: /([A-Z\s-]+?)\s+LOTTERY NO[.]?/i,
  DRAW_NUMBER: /LOTTERY NO[.:]\s*([A-Z0-9-]+)/i,
  DATE: /(\d{2}\/\d{2}\/\d{4})/i,
  // Relaxed TIME: match time even if stuck to comma/text, allow dot or colon
  TIME: /(?:[:.,\s]|^)(\d{1,2}\s*[:.]\s*\d{2}\s*[AP]M)/i,

  // Ticket patterns
  FULL_TICKET: /[A-Z]{2}\s?\d{6}/g,
  ENDING_NUMBER: /\b\d{4}\b/g,

  // Mashed endings (long string of digits)
  MASHED_DIGITS: /\b\d{12,}\b/g,

  // Footer patterns
  NEXT_DRAW_DATE:
    /Next\s+.*?Draw.*?held\s+on\s*[:.-]?\s*(\d{2}\/\d{2}\/\d{4})/i,
  NEXT_DRAW_LOC:
    /held\s+on\s+\d{2}\/\d{2}\/\d{4}\s+at\s+(.*?)(?:Directorate|$)/i,
  // More robust Issuer: Matches Name followed directly by Title (Joint/Deputy/General Director)
  ISSUER: /([A-Z. ]{3,})\s+((?:Joint|Deputy|General)\s+Director)/i,
};

export const SECTION_HEADERS = [
  "1st Prize",
  "2nd Prize",
  "3rd Prize",
  "4th Prize",
  "5th Prize",
  "6th Prize",
  "7th Prize",
  "8th Prize",
  "Cons Prize",
  "Consolation Prize",
  "9th Prize",
  "10th Prize",
];
