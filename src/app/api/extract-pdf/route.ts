// app/api/extract-pdf/route.ts
import { NextResponse } from "next/server";
// import pdf from 'pdf-parse';
import parsePDF from "../../../../custom-pdf-parse";
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
  issuedBy?: string;
  issuerTitle?: string;
}

export async function POST(request: Request) {
  try {
    const { pdfBase64 } = await request.json();
    const pdfBuffer = Buffer.from(pdfBase64.split(",")[1], "base64");
    const data = await parsePDF(pdfBuffer);

    const extractedData = extractLotteryData(data.text);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
function formatDateForInput(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd format
}

function extractLotteryData(text: string): ExtractedData {
  // Normalize line endings and clean up text
  const cleanText = text.replace(/\r\n/g, "\n").replace(/\s+/g, " ");
  const { issuedBy, issuerTitle } = extractIssuerDetails(cleanText);

  return {
    lottery: extractValue(cleanText, /([A-Za-z\s-]+)\s+LOTTERY NO\./)
      .replace(/^in\s+/i, "")
      .trim(),
    drawNumber: extractValue(
      cleanText,
      /LOTTERY NO\.\s*([A-Za-z-]+\d+)/
    ).trim(),
    drawDate: formatDateForInput(
      extractValue(cleanText, /held on:- (\d{2}\/\d{2}\/\d{4})/)
    ),
    drawTime: extractValue(cleanText, /,([0-9:]+ [AP]M)/),
    location: extractValue(cleanText, /AT (.*?)\s+1st/),
    prizes: {
      firstPrize: extractFirstPrize(cleanText),
      consolationPrize: extractConsolationPrize(cleanText),
      secondPrize: extractSecondPrize(cleanText),
      thirdPrize: extractThirdPrize(cleanText),
      fourthPrize: extractFourthPrize(cleanText),
      fifthPrize: extractFifthPrize(cleanText),
      sixthPrize: extractSixthPrize(cleanText),
      seventhPrize: extractSeventhPrize(cleanText),
      eighthPrize: extractEighthPrize(cleanText),
    },
    nextDrawDate: formatDateForInput(
      extractValue(
        cleanText,
        /Next [A-Z\s-]+ Draw will be held on (\d{2}\/\d{2}\/\d{4})/i
      )
    ),
    nextDrawLocation: extractValue(
      cleanText,
      /held on \d{2}\/\d{2}\/\d{4} at (.*?) Directorate/i
    ),
    issuedBy: issuedBy,
    issuerTitle: issuerTitle,
  };
}

// Helper function to safely extract values
function extractValue(text: string, regex: RegExp): string {
  return text.match(regex)?.[1]?.trim() || "";
}

function extractFirstPrize(text: string): PrizeData {
  const amountMatch = text.match(/1st Prize Rs :([0-9,]+)/);
  const ticketMatch = text.match(/1\) (.*?) \(/);
  const locationMatch = text.match(/\((.*?)\)/);

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0,
    ticket: ticketMatch?.[1]?.trim() || "",
    location: locationMatch?.[1]?.trim() || "",
  };
}

function extractConsolationPrize(text: string): PrizeData {
  const amountMatch = text.match(/Cons Prize-Rs ?:([0-9,]+)/);

  // Get everything after "Cons Prize-Rs" till the next prize section
  const consolationStartIndex = text.indexOf("Cons Prize-Rs");
  const secondPrizeIndex = text.indexOf("2nd Prize Rs");
  const thirdPrizeIndex = text.indexOf("3rd Prize Rs");

  // Determine where the consolation section ends
  const endIndex =
    secondPrizeIndex !== -1
      ? secondPrizeIndex
      : thirdPrizeIndex !== -1
      ? thirdPrizeIndex
      : text.length;

  const consolationSection = text.slice(consolationStartIndex, endIndex);

  // Extract all valid ticket codes like "AB 123456"
  const ticketMatches = [...consolationSection.matchAll(/[A-Z]{2} \d{6}/g)];
  const winners = ticketMatches.map((match) => ({
    ticket: match[0].trim(),
  }));

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0,
    winners,
  };
}

function extractSecondPrize(text: string): PrizeData {
  const amountMatch = text.match(/2nd Prize Rs :([0-9,]+)/);
  const ticketMatch = text.match(/2nd Prize Rs :[0-9,]+.*?1\) (.*?) \(/);
  const locationMatch = text.match(/2nd Prize Rs :[0-9,]+.*?\((.*?)\)/);

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0,
    ticket: ticketMatch?.[1]?.trim() || "",
    location: locationMatch?.[1]?.trim() || "",
  };
}

function extractThirdPrize(text: string): PrizeData {
  const amountMatch = text.match(/3rd Prize Rs :([0-9,]+)/);
  const winnersSection = text.split("3rd Prize Rs :")[1]?.split("---")[0] || "";
  const winnerMatches = [
    ...winnersSection.matchAll(/\d+\) ([A-Z]{2} [0-9]+) \((.*?)\)/g),
  ];

  return {
    amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0,
    winners: winnerMatches.map((match) => ({
      ticket: match[1].trim(),
      location: match[2].trim(),
    })),
  };
}
function extractFourthPrize(text: string): PrizeData {
  const amountMatch = text.match(/4th Prize-Rs\s*:?([0-9,]+)\/-/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

  const startIndex = text.indexOf("4th Prize-Rs");
  if (startIndex === -1) return { amount, numbers: [] };

  // Slice from "4th Prize-Rs" onward
  const afterFourth = text.slice(startIndex);

  // Remove the amount part and get everything after it
  const prizeDataStart = afterFourth
    .replace(/4th Prize-Rs\s*:?([0-9,]+)\/-/, "")
    .trim();

  // Extract exactly 72 digits (18 x 4-digit numbers)
  const digitsOnly = prizeDataStart.replace(/\D/g, "").slice(0, 72);

  // Chunk into 4-digit groups
  const numbers: string[] = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    numbers.push(digitsOnly.slice(i, i + 4));
  }

  return {
    amount,
    numbers,
  };
}
function extractFifthPrize(text: string): PrizeData {
  const amountMatch = text.match(/5th Prize[-Rs\s:]+([0-9,]+)\/-/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

  const startIndex = text.indexOf("5th Prize-Rs");
  if (startIndex === -1) return { amount, numbers: [] };

  // Get the full block starting at '5th Prize'
  const afterFifth = text.slice(startIndex);

  // Remove the heading part (label + amount)
  const cleaned = afterFifth
    .replace(/5th Prize[-Rs\s:]+([0-9,]+)\/-/, "")
    .trim();

  // Remove non-digit characters and take first 40 digits (10 x 4-digit numbers)
  const digitsOnly = cleaned.replace(/\D/g, "").slice(0, 40);

  const numbers: string[] = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    numbers.push(digitsOnly.slice(i, i + 4));
  }

  return {
    amount,
    numbers,
  };
}
function extractSixthPrize(text: string): PrizeData {
  const amountMatch = text.match(/6th Prize[-Rs\s:]+([0-9,]+)\/-/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

  const startIndex = text.indexOf("6th Prize-Rs");
  if (startIndex === -1) return { amount, numbers: [] };

  const afterSixth = text.slice(startIndex);
  const cleaned = afterSixth
    .replace(/6th Prize[-Rs\s:]+([0-9,]+)\/-/, "")
    .trim();
  const digitsOnly = cleaned.replace(/\D/g, "").slice(0, 56); // 14 × 4 digits

  const numbers: string[] = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    numbers.push(digitsOnly.slice(i, i + 4));
  }

  return {
    amount,
    numbers,
  };
}
function extractSeventhPrize(text: string): PrizeData {
  const amountMatch = text.match(/7th Prize[-Rs\s:]+([0-9,]+)\/-/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

  const startIndex = text.indexOf("7th Prize-Rs");
  if (startIndex === -1) return { amount, numbers: [] };

  const afterSeventh = text.slice(startIndex);
  const cleaned = afterSeventh
    .replace(/7th Prize[-Rs\s:]+([0-9,]+)\/-/, "")
    .trim();
  const digitsOnly = cleaned.replace(/\D/g, "").slice(0, 320); // 80 × 4 digits

  const numbers: string[] = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    numbers.push(digitsOnly.slice(i, i + 4));
  }

  return {
    amount,
    numbers,
  };
}
function extractEighthPrize(text: string): PrizeData {
  const amountMatch = text.match(/8th Prize[-Rs\s:]+([0-9,]+)\/-/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

  const startIndex = text.indexOf("8th Prize-Rs");
  if (startIndex === -1) return { amount, numbers: [] };

  const afterEighth = text.slice(startIndex);

  // Remove everything up to the amount
  const cleaned = afterEighth
    .replace(/8th Prize[-Rs\s:]+([0-9,]+)\/-/, "")
    .trim();

  // Break into chunks and remove footer-related content
  const tokens = cleaned.split(/[\s]+/);

  const filtered = tokens.filter(
    (token) =>
      !token.includes("Page") &&
      !token.includes("Modernization") &&
      !token.includes("Department") &&
      !/\d{2}\/\d{2}\/\d{4}/.test(token) && // remove dates
      !/^\d{2}:\d{2}:\d{2}$/.test(token) && // remove time stamps
      /^[0-9]+$/.test(token) // keep only digits
  );

  // Join everything together as one digit stream
  const digitStream = filtered.join("").slice(0, 496); // 124 * 4

  const numbers: string[] = [];
  for (let i = 0; i < digitStream.length; i += 4) {
    numbers.push(digitStream.slice(i, i + 4));
  }

  return {
    amount,
    numbers,
  };
}
function extractIssuerDetails(text: string): {
  issuedBy: string;
  issuerTitle: string;
} {
  const footerMatch =
    text.match(/Sd\/-\s*([A-Z\s.]+?)\s+([A-Z][a-z]+ Director)/) ||
    text.match(/([A-Z\s.]+?)\s+([A-Z][a-z]+ Director)/);

  if (footerMatch) {
    const issuedBy = footerMatch[1].trim().replace(/\s+/g, " ");
    const issuerTitle = footerMatch[2].trim();
    return { issuedBy, issuerTitle };
  }

  return { issuedBy: "", issuerTitle: "" };
}
