/**
 * Prize checking logic for lottery tickets
 */

interface PrizeWinner {
  ticket: string;
  location?: string;
}

interface Prize {
  amount: number;
  ticket?: string;
  location?: string;
  numbers?: string[];
  winners?: PrizeWinner[];
}

interface LotteryResult {
  id: string;
  lotteryName: string;
  drawNumber: string;
  drawDate: string;
  prizes: {
    firstPrize: Prize;
    consolationPrize: Prize;
    secondPrize: Prize;
    thirdPrize: Prize;
    fourthPrize: Prize;
    fifthPrize: Prize;
    sixthPrize: Prize;
    seventhPrize: Prize;
    eighthPrize: Prize;
    ninthPrize?: Prize;
    tenthPrize?: Prize;
  };
}

export interface PrizeInfo {
  amount: number;
  level: string;
  matchType: "full" | "last4";
  ticket: string;
  location?: string;
}

export interface TicketCheckResult {
  won: boolean;
  prize?: PrizeInfo;
}

/**
 * Checks if a ticket won any prize in the lottery
 */
export function checkTicketPrize(
  ticket: string,
  lottery: LotteryResult,
): TicketCheckResult {
  const normalizedTicket = ticket.trim().toUpperCase();
  const ticketNumber = normalizedTicket.replace(/\D/g, "");
  const last4 = ticketNumber.slice(-4);

  const { prizes } = lottery;

  // Check 1st Prize
  if (prizes.firstPrize.ticket?.toUpperCase() === normalizedTicket) {
    return {
      won: true,
      prize: {
        amount: prizes.firstPrize.amount,
        level: "1st Prize",
        matchType: "full",
        ticket: normalizedTicket,
        location: prizes.firstPrize.location,
      },
    };
  }

  // Check Consolation Prize
  if (prizes.consolationPrize.winners) {
    const consolationWin = prizes.consolationPrize.winners.find(
      (w) => w.ticket.toUpperCase() === normalizedTicket,
    );
    if (consolationWin) {
      return {
        won: true,
        prize: {
          amount: prizes.consolationPrize.amount,
          level: "Consolation Prize",
          matchType: "full",
          ticket: normalizedTicket,
          location: consolationWin.location,
        },
      };
    }
  }

  // Check 2nd Prize
  if (prizes.secondPrize.ticket?.toUpperCase() === normalizedTicket) {
    return {
      won: true,
      prize: {
        amount: prizes.secondPrize.amount,
        level: "2nd Prize",
        matchType: "full",
        ticket: normalizedTicket,
        location: prizes.secondPrize.location,
      },
    };
  }

  // Check 2nd Prize winners (if multiple)
  if (prizes.secondPrize.winners) {
    const secondWin = prizes.secondPrize.winners.find(
      (w) => w.ticket.toUpperCase() === normalizedTicket,
    );
    if (secondWin) {
      return {
        won: true,
        prize: {
          amount: prizes.secondPrize.amount,
          level: "2nd Prize",
          matchType: "full",
          ticket: normalizedTicket,
          location: secondWin.location,
        },
      };
    }
  }

  // Check 3rd Prize
  if (prizes.thirdPrize.winners) {
    const thirdWin = prizes.thirdPrize.winners.find(
      (w) => w.ticket.toUpperCase() === normalizedTicket,
    );
    if (thirdWin) {
      return {
        won: true,
        prize: {
          amount: prizes.thirdPrize.amount,
          level: "3rd Prize",
          matchType: "full",
          ticket: normalizedTicket,
          location: thirdWin.location,
        },
      };
    }
  }

  // Check 4th-10th prizes (last 4 digits)
  const numberPrizes = [
    { key: "fourthPrize", label: "4th Prize" },
    { key: "fifthPrize", label: "5th Prize" },
    { key: "sixthPrize", label: "6th Prize" },
    { key: "seventhPrize", label: "7th Prize" },
    { key: "eighthPrize", label: "8th Prize" },
    { key: "ninthPrize", label: "9th Prize" },
    { key: "tenthPrize", label: "10th Prize" },
  ] as const;

  for (const { key, label } of numberPrizes) {
    const prize = prizes[key as keyof typeof prizes] as Prize | undefined;
    if (!prize || !prize.numbers) continue;

    const match = prize.numbers.find((num) => num === last4);
    if (match) {
      return {
        won: true,
        prize: {
          amount: prize.amount,
          level: `${label} (Last 4 digits)`,
          matchType: "last4",
          ticket: last4,
        },
      };
    }
  }

  // No prize won
  return { won: false };
}
