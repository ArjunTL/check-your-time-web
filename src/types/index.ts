export interface LotteryResult {
    extractedAt: string;
    source: string;
    lotteryName?: string;
    lotteryNumber?: string;
    drawDate?: string;
    drawLocation?: {
      venue?: string;
      area?: string;
      city?: string;
    };
    firstPrize?: {
      amount: number;
      ticketNumber: string;
      district: string;
    };
    secondPrize?: {
      amount: number;
      ticketNumber: string;
      district: string;
    };
    thirdPrizes?: Array<{
      amount: number;
      ticketNumber: string;
      district: string;
    }>;
    // Add other prize types as needed
  }