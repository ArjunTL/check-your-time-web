import { normalizeText, chunkMashedNumbers } from "./cleaner";
import { PATTERNS, SECTION_HEADERS } from "./constants";
import { ParsedLotteryResult, PrizeData, PrizeWinner } from "./types";

export class LotteryParser {
  // Normalize and parse raw text
  public parse(rawText: string): ParsedLotteryResult {
    const text = normalizeText(rawText);

    const parsed: ParsedLotteryResult = {
      lotteryName: "",
      drawNumber: "",
      drawDate: "",
      drawTime: "",
      location: "",
      prizes: {},
    };

    // 1. Extract Header Info
    parsed.lotteryName = this.extractValue(text, PATTERNS.LOTTERY_NAME)
      .replace(/^in\s+/i, "")
      .trim();

    // Fix: Remove 'th' or similar suffixes from Draw Number (e.g. "SK-38th" -> "SK-38")
    parsed.drawNumber = this.extractValue(text, PATTERNS.DRAW_NUMBER)
      .replace(/(st|nd|rd|th)$/i, "")
      .trim();

    parsed.drawDate = this.formatDateForInput(
      this.extractValue(text, PATTERNS.DATE),
    );
    parsed.drawTime = this.extractValue(text, PATTERNS.TIME);

    // Location often appears after "AT" and before "1st Prize"
    // Heuristic: Find text between TIME and "1st Prize"
    const locationMatch = text.match(/AT\s+([\s\S]*?)(?=\s*1st Prize)/i);
    parsed.location = locationMatch
      ? locationMatch[1].replace(/\n/g, " ").trim()
      : "";
    // Clean up trailing commas in location
    if (parsed.location.endsWith(",")) {
      parsed.location = parsed.location.slice(0, -1);
    }

    // 2. Split into sections
    const sections = this.splitIntoSections(text);

    // 3. Parse each section
    for (const [key, sectionText] of Object.entries(sections)) {
      const prizeData = this.parsePrizeSection(key, sectionText);
      // Map to keys expected by frontend (camelCase)
      const camelKey = this.toCamelCase(key);
      parsed.prizes[camelKey] = prizeData;
    }

    // 4. Capture Footer Info
    const nextDrawDate = text.match(PATTERNS.NEXT_DRAW_DATE);
    if (nextDrawDate) {
      parsed.nextDrawDate = this.formatDateForInput(nextDrawDate[1]);
    }

    const nextDrawLoc = text.match(PATTERNS.NEXT_DRAW_LOC);
    if (nextDrawLoc) {
      parsed.nextDrawLocation = nextDrawLoc[1].trim();
    }

    // Issuer details
    const issuerMatch = text.match(PATTERNS.ISSUER);
    if (issuerMatch) {
      (parsed as unknown as Record<string, string>).issuedBy =
        issuerMatch[1].trim();
      (parsed as unknown as Record<string, string>).issuerTitle =
        issuerMatch[2].trim();
    }

    return parsed;
  }

  private splitIntoSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};

    // We need to find the indices of all headers
    const sortedHeaders = SECTION_HEADERS.map((header) => {
      // Flexible match for headers
      const regex = new RegExp(header.replace(/ /g, "[\\s-]"), "i");
      const match = text.match(regex);
      return {
        header: header, // canonical name
        index: match ? match.index : -1,
        length: match ? match[0].length : 0,
      };
    })
      .filter((h) => h.index !== -1)
      .sort((a, b) => a.index! - b.index!);

    for (let i = 0; i < sortedHeaders.length; i++) {
      const current = sortedHeaders[i];
      const next = sortedHeaders[i + 1];

      const end = next ? next.index! : text.length;

      // Better: pass the FULL text chunk starting from the header start to include amount
      const fullSectionChunk = text.substring(current.index!, end);

      sections[current.header] = fullSectionChunk;
    }

    return sections;
  }

  private parsePrizeSection(key: string, sectionText: string): PrizeData {
    // 1. Extract Amount
    const amountMatch = sectionText.match(/Rs\s*[:.]?\s*([0-9,]+)/i);
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

    // 2. Determine Prize Type
    const hasFullTickets = /[A-Z]{2}\s?\d{6}/i.test(sectionText);

    if (hasFullTickets) {
      const winners = this.extractWinners(sectionText);

      const prize: PrizeData = {
        label: key,
        amount,
        winners,
      };

      // Map first winner to root ticket/location for UI compatibility
      if (winners.length > 0) {
        (prize as unknown as Record<string, string | undefined>).ticket =
          winners[0].ticket;
        (prize as unknown as Record<string, string | undefined>).location =
          winners[0].location;
      }

      return prize;
    } else {
      const numbers = this.extractNumbers(sectionText);
      return {
        label: key,
        amount,
        numbers,
      };
    }
  }

  private extractWinners(text: string): PrizeWinner[] {
    const winners: PrizeWinner[] = [];

    // Regex for Full Ticket + Optional Location in parens
    // Matches: "1) AB 123456 (LOC)" or "AB 123456"
    // We iterate through all matches
    const pattern = /([A-Z]{2})\s?(\d{6})(?:\s*\((.*?)\))?/gi;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      winners.push({
        ticket: `${match[1]} ${match[2]}`,
        location: match[3] ? match[3].trim() : undefined,
      });
    }
    return winners;
  }

  private extractNumbers(text: string): string[] {
    // This section contains 4-digit numbers.
    // They might be space separated "1234 5678"
    // Or mashed "12345678"

    // First, remove the header parts to avoid parsing the amount "5000" as a winning number
    // We already extracted amount.
    // Safe generic way: strip the first line or header-like text
    const cleanBody = text.replace(/.*Rs\s*[:.]?\s*[0-9,]+.*?-?/i, "");

    const numbers: string[] = [];
    const tokens = cleanBody.split(/[\s,]+/);

    for (const token of tokens) {
      const cleanToken = token.trim();
      if (!cleanToken) continue;

      // Standard case: 4 digits
      if (/^\d{4}$/.test(cleanToken)) {
        numbers.push(cleanToken);
      }
      // Mashed case: multiple of 4 digits (>4)
      else if (/^\d{8,}$/.test(cleanToken)) {
        const chunks = chunkMashedNumbers(cleanToken);
        numbers.push(...chunks);
      }
      // Handle 5-digit prizes if any (rare but possible in some bumpers)
      else if (/^\d{5}$/.test(cleanToken)) {
        numbers.push(cleanToken);
      }
    }

    return numbers;
  }

  private extractValue(text: string, regex: RegExp): string {
    return text.match(regex)?.[1]?.trim() || "";
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  private toCamelCase(str: string): string {
    const map: Record<string, string> = {
      "1st Prize": "firstPrize",
      "2nd Prize": "secondPrize",
      "3rd Prize": "thirdPrize",
      "4th Prize": "fourthPrize",
      "5th Prize": "fifthPrize",
      "6th Prize": "sixthPrize",
      "7th Prize": "seventhPrize",
      "8th Prize": "eighthPrize",
      "Cons Prize": "consolationPrize",
      "Consolation Prize": "consolationPrize",
      "9th Prize": "ninthPrize",
      "10th Prize": "tenthPrize",
    };
    return map[str] || str.toLowerCase().replace(/\s/g, "");
  }
}
