import terraformResource from '../source_resources/main.tf.json';
// @ts-ignore
import aws_s3_bucket from '../source_resources/aws_s3_bucket/resource.json';
// @ts-ignore
import aws_lambda from '../source_resources/lambda/resource.json';
import Configuration from "./Configuration";
export default class Generator {
  private clonedObj: any;
  private resourceType: any;

  constructor(resourceType: 's3' | 'lambda') {
    if (resourceType === 's3') {
      this.resourceType = resourceType;
      this.clonedObj = { ...aws_s3_bucket }; // Clone the aws_s3_bucket object
    } else if (resourceType === 'lambda') {
      this.resourceType = resourceType;
      this.clonedObj = { ...aws_lambda }; // Clone the aws_lambda object
    } else {
      throw new Error('Invalid resource type. Use "s3" or "lambda".');
    }
    
  }

  private updateJsonByKey(obj: any, key: string, newValue: any): any {
    if (typeof obj === 'object') {
      if (obj.hasOwnProperty(key)) {
        obj[key] = newValue;
      }
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          obj[prop] = this.updateJsonByKey(obj[prop], key, newValue);
        }
      }
    }
    return obj;
  }

  generate() {
    if (this.resourceType === 's3') {
      const result = this.updateJsonByKey(this.clonedObj, 'acl', 'private');

      console.log(terraformResource.resource.aws_s3_bucket);

      const config: any = Configuration();
      config.writeTo('./generated/aws/s3_bucket/resource.tf.json', result);
    } else if (this.resourceType === 'lambda') {
      this.clonedObj.resource.aws_lambda_function.my_lambda.kms_key_arn = "arn:aws:kms:us-east-1:000000000000:key/1234abcd-12ab-34cd-56ef-1234567890ab";
      console.log(this.clonedObj.resource.aws_lambda_function.my_lambda);
  
      const config: any = Configuration();
      config.writeTo('./generated/aws/lambda/resource.tf.json', this.clonedObj);
    }
  }
}
// For generating S3 Config:
const s3Generator = new Generator('s3');
s3Generator.generate();

// For generating Lambda Config:
const lambdaGenerator = new Generator('lambda');
lambdaGenerator.generate();