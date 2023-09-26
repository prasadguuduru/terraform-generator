// @ts-ignore
import generateTerraformMappings from '../../source_resources/generate.json';
import Generator from "./Generator";
const methods: { [key: string]: () => void } = {
    s3: () => {

        // For generating S3 Config:
        const s3Generator = new Generator('s3');
        s3Generator.generate();
    },
    lambda: () => {
        console.log('lambda is invoked.');


        // For generating Lambda Config:
        const lambdaGenerator = new Generator('lambda');
        lambdaGenerator.generate();
    },
    apigateway: () => {
        console.log('apigateway is invoked.');
    },
};

async function main() {
    try {
        //const jsonFilePath = '../source_resources/generate.json'; // Change this to your JSON file path
        //const jsonData = await readJsonFile(jsonFilePath);
        const jsonData: any = generateTerraformMappings;
        // Loop through JSON keys and invoke corresponding methods
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const methodName = jsonData[key];
                const method = methods[methodName];
                console.log(`HELLO ${methodName} for resource: ${key}`);
                if (method) {
                    console.log(`Invoking ${methodName} for resource: ${key}`);
                    method();
                } else {
                    console.error(`Method not found for resource: ${methodName}`);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();