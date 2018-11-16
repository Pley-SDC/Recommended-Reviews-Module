const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const request = require('request');
const { sprintf } = require('sprintf-js');

const imageDir = 'images'; // make this directory prior to running, otherwise it will throw an error
const runs = 1000; // set number of runs here

const urlOptions = {
  baseUrl: 'https://loremflickr.com',
  width: '300', // width in pixels of images
  height: '300', // height in pixels of images
  topic: 'food', // topic
};

const timeoutInterval = 2000;
let timeout = 0;

const url = `${urlOptions.baseUrl}/${urlOptions.width}/${urlOptions.height}/${urlOptions.topic}`;

for (let i = 1; i <= runs; i += 1) {
  const imageName = sprintf('%05s.jpg', i); // image format style is 00001.jpg
  const imagePath = path.join(imageDir, imageName);
  setTimeout(() => {
    const stream = request(url).pipe(fs.createWriteStream(imagePath));
    stream.on('finish', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Image ${i} written to images/${imageName}`);
      }
    });
  }, timeout);
  timeout += timeoutInterval;
}
