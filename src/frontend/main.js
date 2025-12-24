import HTMLParser from "./HTMLParser.js";

async function test() {
    const parser = new HTMLParser();
    await parser.fetchHTML("https://www.youtube.com/@sonic77852");
    document.getElementById("output").textContent = parser.html;
}

test();