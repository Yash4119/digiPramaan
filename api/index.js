const puppeteer = require("puppeteer");
const fs = require("fs");
const crypto = require('crypto');

const jsonData = {
  eventName: "PPO",
  dateOfIssuance: new Date().toLocaleDateString(),
  issuerName: "Kartikey Singh",
  issuerID: 98,
  recieverName: "Yash Ambekar",
  recipientID: 8972,
  organizationID: 97867,
  organizationName: "DPU",
};

async function generateCertificate(jsonData, outputPath) {
  const htmlTemplate = fs.readFileSync("./templates/participate.html", "utf-8");
  const htmlContent = htmlTemplate
    .replace("{{eventName}}", jsonData.eventName)
    .replace("{{dateOfIssuance}}", jsonData.dateOfIssuance)
    .replace("{{issuerName}}", jsonData.issuerName)
    .replace("{{issuerID}}", jsonData.issuerID)
    .replaceAll("{{recieverName}}", jsonData.recieverName)
    .replace("{{recipientID}}", jsonData.recipientID)
    .replace("{{organizationID}}", jsonData.organizationID)
    .replace("{{organizationName}}", jsonData.organizationName);

  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "load" });

  await page.pdf({ path: outputPath, height: 542 , printBackground: true });

  await browser.close();

  console.log(`Certificate PDF generated successfully at: ${outputPath}`);
  const pdfBuffer = fs.readFileSync(outputPath);
  const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
  console.log(`SHA-256 Hash of the PDF: ${hash}`);
}

const outputPath = "certificate.pdf";

generateCertificate(jsonData, outputPath);
