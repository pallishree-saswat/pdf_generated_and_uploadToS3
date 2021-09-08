const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");

const data1 = require("./data.json");
const user = require("./user.json");
/* var masterData = [];
masterData.push(data1);
masterData.push(user);
// const datan = JSON.stringify(masterData)
const data = Object.assign({},masterData) ; */

// const data = {};
// data.data = data1;
// data.user = user;

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "views", `${templateName}.ejs`);
  const html = await fs.readFile(filePath, "utf-8");
  console.log(html);
  return ejs.compile(html)(data);
};

const pdf = async function () {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const content = await compile("list", {data1,user});
    await page.setContent(content);
    await page.emulateMediaFeatures("screen");
    await page.pdf({
      path: "mydoc.pdf",
      format: "A4",
      printBackground: true,
    });
    console.log("done");
    await browser.close();
    process.exit();
  } catch (err) {
    console.log("error", err);
  }
};

// pdf();
module.exports = pdf;
