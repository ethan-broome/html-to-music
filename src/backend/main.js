import HTMLParser from "./HTMLParser";



const TEST_URL = "https://ihasabucket.com/";
const TEST_URL_PATH = "../../tests/ihasabucket.htm";

const parserTest = new HTMLParser();
const doc = parserTest.setHTMLString(TEST_URL_PATH);
console.log(doc.title);
