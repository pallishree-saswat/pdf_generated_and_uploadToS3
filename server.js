const { nanoid } = require("nanoid");
const pdf = require('./app')
const AWS = require("aws-sdk");
const fs = require("fs")
const express = require("express")
const app = express()

const bucketName = "mjunction-digital-asset";
const awsConfig = {
  accessKeyId: "AKIAWTU5HR2DQH5TBOFK",
  secretAccessKey: "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",
  region: "us-east-1",
};

const S3 = new AWS.S3(awsConfig);

app.get('/', (req,res) => {
    pdf();

    //save pdf to s3 bucket
    const fileStream = fs.createReadStream('mydoc.pdf');
    let type = "pdf";
    const params = {
      Bucket: bucketName,
      Key: `new_pdf/${nanoid()}.${type}`,
      Body: fileStream,
    
      ContentType: "application/pdf",
    };
    
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send("uploaded to s3")
    });
})


app.listen(2000, () => {
    console.log("server is running")
})

