import HTMLParser from "./HTMLParser";



const TEST_URL = "http://ninjaflex.com/"

parserTest = new HTMLParser(TEST_URL);
console.log(parserTest.doc.title);
