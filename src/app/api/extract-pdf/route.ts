// app/api/extract-pdf/route.ts
import { NextResponse } from 'next/server';
// import pdf from 'pdf-parse';
import parsePDF from '../../../../custom-pdf-parse';
interface PrizeWinner {
  ticket: string;
  location?: string;
}

interface PrizeData {
  amount: number;
  ticket?: string;
  location?: string;
  numbers?: string[];
  winners?: PrizeWinner[];
}

interface ExtractedData {
  lottery: string;
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  location: string;
  prizes: {
    firstPrize: PrizeData;
    consolationPrize: PrizeData;
    secondPrize: PrizeData;
    thirdPrize: PrizeData;
    fourthPrize: PrizeData;
    fifthPrize: PrizeData;
    sixthPrize: PrizeData;
    seventhPrize: PrizeData;
    eighthPrize: PrizeData;
  };
  nextDrawDate?: string;
  nextDrawLocation?: string;
}

export async function POST(request: Request) {
  console.log("POST request received");
  try {
    const { pdfBase64 } = await request.json();
    const pdfBuffer = Buffer.from(pdfBase64.split(',')[1], 'base64');
    const data = await parsePDF(pdfBuffer);
    
    const extractedData = extractLotteryData(data.text);
    console.log("Extracted text:", data.text);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
function formatDateForInput(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd format
}

function extractLotteryData(text: string): ExtractedData {
  // Normalize line endings and clean up text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  return {
    lottery: extractValue(cleanText, /([A-Za-z\s-]+)\s+LOTTERY NO\./).replace(/^in\s+/i, '').trim(),
    drawNumber: extractValue(cleanText, /LOTTERY NO\.\s*([A-Za-z-]+\d+)/).trim(),
    drawDate: formatDateForInput(extractValue(cleanText, /held on:- (\d{2}\/\d{2}\/\d{4})/)),
    drawTime: extractValue(cleanText, /,([0-9:]+ [AP]M)/),
    location: extractValue(cleanText, /AT (.*?)\s+1st/),
    prizes: {
      firstPrize: extractFirstPrize(cleanText),
      consolationPrize: extractConsolationPrize(cleanText),
      secondPrize: extractSecondPrize(cleanText),
      thirdPrize: extractThirdPrize(cleanText),
      fourthPrize: extractNumberPrize(cleanText, '4th'),
      fifthPrize: extractNumberPrize(cleanText, '5th'),
      sixthPrize: extractNumberPrize(cleanText, '6th'),
      seventhPrize: extractNumberPrize(cleanText, '7th'),
      eighthPrize: extractNumberPrize(cleanText, '8th')
    },
    nextDrawDate: extractValue(cleanText, /Next WIN-WIN Draw will be held on (.*?) at/),
    nextDrawLocation: extractValue(cleanText, /at (.*?)\n/)
  };
}

// Helper function to safely extract values
function extractValue(text: string, regex: RegExp): string {
  return text.match(regex)?.[1]?.trim() || '';
}

function extractFirstPrize(text: string): PrizeData {
  const amountMatch = text.match(/1st Prize Rs :([0-9,]+)/);
  const ticketMatch = text.match(/1\) (.*?) \(/);
  const locationMatch = text.match(/\((.*?)\)/);

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
    ticket: ticketMatch?.[1]?.trim() || '',
    location: locationMatch?.[1]?.trim() || ''
  };
}

function extractConsolationPrize(text: string): PrizeData {
  const amountMatch = text.match(/Cons Prize-Rs :([0-9,]+)/);
  const ticketsSection = text.split('Cons Prize-Rs :')[1]?.split('\n')[1] || '';
  const tickets = ticketsSection.match(/[A-Z]{2} [0-9]+/g) || [];

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
    winners: tickets.map(ticket => ({ ticket: ticket.trim() }))
  };
}

function extractSecondPrize(text: string): PrizeData {
  const amountMatch = text.match(/2nd Prize Rs :([0-9,]+)/);
  const ticketMatch = text.match(/2nd Prize Rs :[0-9,]+.*?1\) (.*?) \(/);
  const locationMatch = text.match(/2nd Prize Rs :[0-9,]+.*?\((.*?)\)/);

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
    ticket: ticketMatch?.[1]?.trim() || '',
    location: locationMatch?.[1]?.trim() || ''
  };
}

function extractThirdPrize(text: string): PrizeData {
  const amountMatch = text.match(/3rd Prize Rs :([0-9,]+)/);
  const winnersSection = text.split('3rd Prize Rs :')[1]?.split('---')[0] || '';
  const winnerMatches = [...winnersSection.matchAll(/\d+\) ([A-Z]{2} [0-9]+) \((.*?)\)/g)];

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
    winners: winnerMatches.map(match => ({
      ticket: match[1].trim(),
      location: match[2].trim()
    }))
  };
}

function extractNumberPrize(text: string, prize: string): PrizeData {
  const amountMatch = text.match(new RegExp(`${prize} Prize-Rs :([0-9,]+)`));
  const numbersSection = text.split(`${prize} Prize-Rs :`)[1]?.split('\n')[0] || '';
  const numbers = [...numbersSection.matchAll(/\b\d{4}\b/g)].map(match => match[0]);

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
    numbers: numbers.length > 0 ? numbers : []
  };
}