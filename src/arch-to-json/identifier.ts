export default class Identifier {
    private keywords: string[];
  
    constructor(keywords: string[]) {
      this.keywords = keywords;
    }
  
    identifyKeywords(input: string): string[] {
      const identifiedKeywords: string[] = [];
  
      for (const keyword of this.keywords) {
        if (input.includes(keyword)) {
          identifiedKeywords.push(keyword);
        }
      }
  
      return identifiedKeywords;
    }
  }