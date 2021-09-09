const puppeteer = require("puppeteer");
const fs1 = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const data1 = require("./data.json");
const user = require("./user.json");

const { nanoid } = require("nanoid");
const AWS = require("aws-sdk");
const fs = require("fs");
const bucketName = "xxxxxx";
const awsConfig = {
  accessKeyId: "xxxxxxxxxxx",
  secretAccessKey: "xxxxxxxxxxxx",
  region: "xxxxxxxxxx",
};
const S3 = new AWS.S3(awsConfig);

const uploadPdf = () => {
  return new Promise(async (resolve, reject) => {
    //save pdf to s3 bucket
    const fileStream = fs.createReadStream("mydoc.pdf");
    let type = "pdf";
    const params = {
      Bucket: bucketName,
      Key: `pdf/${nanoid()}.${type}`,
      Body: fileStream,

      ContentType: "application/pdf",
    };

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
        // return res.sendStatus(400);
      }
      console.log(data);
      return resolve(data);
      // res.send("uploaded to s3");
    });
  });
};

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "views", `${templateName}.ejs`);
  const html = await fs1.readFile(filePath, "utf-8");
  // console.log(html);
  return ejs.compile(html)(data);
};

const pdf = async function () {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = await compile("list", { data1, user });
    await page.setContent(content);
    await page.emulateMediaFeatures("screen");
    await page.pdf({
      path: "mydoc.pdf",
      format: "A4",
      printBackground: true,
    });

    console.log("done");

    await uploadPdf();
    await browser.close();
    process.exit();
  } catch (err) {
    console.log("error", err);
  }
};

pdf();
// module.exports = pdf;
