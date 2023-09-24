import * as fs from 'fs-extra';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
class Configuration {
    private resource: Record<string, any>;
    private data: Record<string, any>;
    private module: Record<string, any>;
    private variable: Record<string, any>;
    private locals: Record<string, any>;
    private output: Record<string, any>;
    private provider: Record<string, any>[];

    constructor() {
        this.resource = {};
        this.data = {};
        this.module = {};
        this.variable = {};
        this.locals = {};
        this.output = {};
        this.provider = [];

        Object.defineProperty(this.provider, 'add', { value: this.addProvider });
        Object.defineProperty(this, 'json', {
            get() {
                return JSON.stringify(this, Configuration.jsonFilter, "\t");
            }
        });
    }

    merge(from: Configuration) {
        Configuration.mergeSection(this.resource, from.resource);
        Configuration.mergeSection(this.data, from.data);
        Object.assign(this.module, from.module);
        Object.assign(this.variable, from.variable);
        Object.assign(this.locals, from.locals);
        Object.assign(this.output, from.output);
        this.provider.push(...from.provider);
    }

    writeTo(fileName: string, fileContent:JSON) {
       return writeFile(fileName, JSON.stringify(fileContent));
    }

    private addProvider(providerName: string, providerConfiguration: Record<string, any>) {
        const providerBlock: Record<string, any> = {};
        providerBlock[providerName] = providerConfiguration;
        this.provider.push(providerBlock);
    }

    private static mergeSection(to: Record<string, any>, from: Record<string, any>) {
        for (const className in from) {
            Object.assign(to[className], from[className]);
        }
    }

    private static isEmptyObject(x: any) {
        return typeof x === 'object' && Object.keys(x).length === 0;
    }

    private static jsonFilter( value: any) {
        if (value !== null && !Configuration.isEmptyObject(value)) {
            return value;
        }
    }
}

export default () => new Configuration();
