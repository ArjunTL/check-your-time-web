// app/api/extract-pdf/route.ts
import { NextResponse } from "next/server";
import parsePDF from "../../../../custom-pdf-parse";
import { LotteryParser } from "@/lib/lottery-parser";

export async function POST(request: Request) {
  try {
    const { pdfBase64 } = await request.json();
    const pdfBuffer = Buffer.from(pdfBase64.split(",")[1], "base64");

    // 1. Raw text extraction (using pdf-parse)
    const data = await parsePDF(pdfBuffer);

    // 2. Structured Parsing (using new LotteryParser)
    const parser = new LotteryParser();
    const extractedData = parser.parse(data.text);

    // Map to frontend expected format (frontend expects 'lottery' field)
    const responseData = {
      ...extractedData,
      lottery: extractedData.lotteryName,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 },
    );
  }
}
