require("dotenv").config();
const { strict: assert } = require("assert");
const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();

const upload = (file, key) => {
  assert.ok(file, "Missing file path");
  assert.ok(key, "Missing key");

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    stream.on("error", (err) => {
      reject(err);
    });
    s3.upload(
      {
        Bucket: "salesman-letm",
        Body: stream,
        Key: key,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      }
    );
  });
};

module.exports = { upload };
