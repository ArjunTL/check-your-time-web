export interface PrizeWinner {
  ticket: string;
  location?: string;
  agent?: string;
}

export interface PrizeData {
  amount: number;
  label: string;
  // For high tier prizes with specific winners
  winners?: PrizeWinner[];
  // For lower tier prizes with just numbers
  numbers?: string[];
  // Sometimes we capture the full raw text for debugging if needed
  raw?: string;
}

export interface ParsedLotteryResult {
  lotteryName: string;
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  location: string;
  prizes: Record<string, PrizeData>;
  nextDrawDate?: string;
  nextDrawLocation?: string;
}
