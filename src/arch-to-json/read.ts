import { createWorker, Worker } from 'tesseract.js';

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
runOCR('/Users/pguuduru/proj/rough/git/terraform-generator/src/arch-to-json/aws-serverless.jpg')
  .then((result) => {
    console.log('OCR Result:', result);
  })
  .catch((error) => {
    console.error(error.message); // Log the error message
  });
