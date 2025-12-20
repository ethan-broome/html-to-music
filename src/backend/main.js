import HTMLParser from "./HTMLParser.js";


const TEST_URL = "https://example.com";

const parserTest = new HTMLParser();
const doc = await parserTest.getHTMLDocument(TEST_URL);
console.log(doc.title);
