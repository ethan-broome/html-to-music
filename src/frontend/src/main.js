import HTMLParser from "./classes/HTMLParser.js";
import SongBuilder from "./classes/SongBuilder.js";

const parser = new HTMLParser();
const songBuilder = new SongBuilder();

document.getElementById("submit-button").addEventListener("click", async function() {
    await parser.fetchHTML(document.getElementById("url-input").value);

    //output to index.html
    document.getElementById("url").innerHTML = "<b>URL: </b>" + parser.getURL();
    document.getElementById("title").innerHTML = "<b>TITLE: </b>" + parser.getTitle();
    document.getElementById("num-links").innerHTML = "<b>NUMBER OF LINKS: </b>" + parser.numLinks();
    document.getElementById("num-images").innerHTML = "<b>NUMBER OF IMAGES: </b>" + parser.numImages();
    document.getElementById("num-embeds").innerHTML = "<b>NUMBER OF EMBEDS: </b>" + parser.numEmbeds();
    document.getElementById("compat-mode").innerHTML = "<b>COMPATABILITY MODE: </b>" + parser.compatMode();
    document.getElementById("content-type").innerHTML = "<b>CONTENT TYPE: </b>" + parser.contentType();
    document.getElementById("char-set").innerHTML = "<b>CHARACTER SET: </b>" + parser.characterSet();
    document.getElementById("num-imported-fonts").innerHTML = "<b>NUMBER OF IMPORTED FONTS: </b>" + parser.numImportedFonts();
    document.getElementById("character-counts").innerHTML = parser.printCharCount();
    document.getElementById("html").textContent = parser.getHTML();
});
