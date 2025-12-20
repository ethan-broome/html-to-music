import HTMLParser from "./HTMLParser";



const TEST_URL = "http://ninjaflex.com/"

const parserTest = new HTMLParser();
const doc = parserTest.setHTMLString(TEST_URL);
console.log(doc.title);
