const { strict: assert } = require("assert");
const AWS = require("aws-sdk");
const fs = require("fs");
const { femaleFirstNames, maleFirstNames, lastNames } = require("./data/names.json");

AWS.config.update({ region: "us-east-1" });
const s3 = new AWS.S3();

const uploadS3 = (file, key) => {
  assert.ok(file, "Missing file path");
  assert.ok(key, "Missing key");

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    stream.on("error", (err) => {
      reject(err);
    });
    s3.upload(
      {
        Bucket: "salesman-players",
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

const random = (max) => {
  return Math.floor(Math.random() * max);
};

const randomMaleName = () => {
  return `${maleFirstNames[random(maleFirstNames.length)]} ${lastNames[random(lastNames.length)]}`;
};

const randomFemaleName = () => {
  return `${femaleFirstNames[random(femaleFirstNames.length)]} ${lastNames[random(lastNames.length)]}`;
};

const randomMaleImage = () => {
  return `male-${random(7)}`;
};

const randomFemaleImage = () => {
  return `female-${random(4)}`;
};

module.exports = { uploadS3, random, randomMaleName, randomFemaleName, randomMaleImage, randomFemaleImage };
