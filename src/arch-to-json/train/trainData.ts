const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;
const NUM_CLASSES = 2;

const apigatewayDir = '/Users/pguuduru/proj/rough/git/terraform-generator/src/arch-to-json/train/apigateway';
const lambdaDir = '/Users/pguuduru/proj/rough/git/terraform-generator/src/arch-to-json/train/lambda';

const apiGatewayFiles = fs.readdirSync(apigatewayDir);
const lambdaFiles = fs.readdirSync(lambdaDir);

const apiGateways = apiGatewayFiles.map((file: string) => {
  const filePath = `${apigatewayDir}/${file}`;
  console.log('filepahts ----- '+ filePath);
  if(filePath.endsWith("PNG")) {
    const buffer = fs.readFileSync(filePath);
    const decodedImage = tf.node.decodeImage(buffer);
    const resizedImage = tf.image.resizeBilinear(decodedImage, [IMAGE_WIDTH, IMAGE_HEIGHT]);
    return resizedImage;
  }
});

const lambdas = lambdaFiles.map((file: string) => {
  const filePath = `${lambdaDir}/${file}`;
  if(filePath.endsWith("PNG")) {
    const buffer = fs.readFileSync(filePath);
    const decodedImage = tf.node.decodeImage(buffer);
    const resizedImage = tf.image.resizeBilinear(decodedImage, [IMAGE_WIDTH, IMAGE_HEIGHT]);
    return resizedImage;
  }
});

const images = apiGateways.concat(lambdas);
const labels = tf.tensor2d(
  Array.from({ length: apiGateways.length }).fill([1, 0])
  .concat(Array.from({ length: lambdas.length }).fill([0, 1]))
);

const model = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 3],
  filters: 16,
  kernelSize: 3,
  activation: 'relu'
}));

model.add(tf.layers.maxPooling2d({
  poolSize: 2,
  strides: 2
}));

model.add(tf.layers.conv2d({
  filters: 32,
  kernelSize: 3,
  activation: 'relu'
}));


const BATCH_SIZE = 32;
const NUM_EPOCHS = 10;

model.fit(images, labels, {
  batchSize: BATCH_SIZE,
  epochs: NUM_EPOCHS,
  shuffle: true
});

const MODEL_DIR = './model';

model.save(`file://${MODEL_DIR}`);

model.add(tf.layers.maxPooling2d({
  poolSize: 2,
  strides: 2
}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
  units: 64,
  activation: 'relu'
}));

model.add(tf.layers.dense({
  units: NUM_CLASSES,
  activation: 'softmax'
}));

model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

