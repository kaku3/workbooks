const fs = require('fs');
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

async function main(fileName) {
  const [ result ] = await client.documentTextDetection(
    fileName,
    {
      'language_hints': ['ja']
    }
  );
  fs.writeFileSync('./receipt.json', JSON.stringify(result), 'utf-8');
}

main('./receipt.jpg');
