import { createWorker, Worker } from 'tesseract.js';
import Identifier from './identifier';
import * as fs from 'fs';
import * as path from 'path';
const IMAGE_PATH: string = process.env.path !== undefined ? process.env.path : '';


console.log(IMAGE_PATH);
const generate_json_filepath = path.join(__dirname, '../../../', 'source_resources/', 'generate.json');

async function runOCR(imagePath: string): Promise<string> {
  // Create a Tesseract worker
  const worker: Worker = await createWorker();

  try {
    // Load Tesseract and language data
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Set character whitelist for OCR
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    });

    // Perform OCR on the specified image
    const { data: { text } } = await worker.recognize(imagePath);

    return text;
  } catch (error) {
    throw new Error(`OCR Error: ${error}`);
  } finally {
    // Terminate the Tesseract worker to clean up resources
    await worker.terminate();
  }
}
// Usage example
runOCR(IMAGE_PATH)
  .then((result) => {
    console.log('OCR Result:', result);
    // Usage
    const keywordsToIdentify = ['Lambda', 'S3', 'APIGateway'];

    const identifier = new Identifier(keywordsToIdentify);
    const identifiedKeywords = identifier.identifyKeywords(result);

    console.log('Identified Keywords:', identifiedKeywords);
    const resDict: Record<string, string> = {};
    for (let i = 0; i < identifiedKeywords.length; i++) {
      resDict[`resource${i + 1}`] = identifiedKeywords[i].toLowerCase();

      //const jsonOutputPath = path.join(source_resources_dir, 'generate.json');
      fs.writeFileSync(generate_json_filepath, JSON.stringify(resDict, null, 4), 'utf-8');
      console.log(`Identified resources: ${JSON.stringify(resDict, null, 4)}`);
      console.log(`Results saved to ${generate_json_filepath}`);
    }
  })
  .catch((error) => {
    console.error(error.message); // Log the error message
  });
