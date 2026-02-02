const fs = require("fs");
const path = require("path");

async function runCompatCheck() {
  const file = "271-2069-12-01-2026.pdf";
  console.log(`Checking compatibility on ${file}...`);
  const filePath = path.join(__dirname, "public", file);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");

  try {
    const res = await fetch("http://localhost:3000/api/extract-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdfBase64: `data:application/pdf;base64,${base64}`,
      }),
    });

    const json = await res.json();

    console.log("--- Frontend Compatibility Check ---");
    console.log(`lotteryName field: "${json.lotteryName}"`);
    console.log(`lottery field:     "${json.lottery}"`);

    if (json.lottery && json.lottery === json.lotteryName) {
      console.log("✅ Passed: 'lottery' field is present and correct.");
    } else {
      console.log("❌ Failed: 'lottery' field is missing or incorrect.");
    }
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
  }
}

runCompatCheck();
