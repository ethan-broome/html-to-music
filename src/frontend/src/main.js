import HTMLParser from "./classes/HTMLParser.js";
import SongBuilder from "./classes/SongBuilder.js";

const parser = new HTMLParser();
const songBuilder = new SongBuilder();

document.getElementById("submit-button").addEventListener("click", async function() {
    
    await parser.fetchHTML(document.getElementById("url-input").value);

    const htmlData = {
        url: parser.getURL(),
        title: parser.getTitle(),
        numLinks: parser.numLinks(),
        numImages: parser.numImages(),
        numEmbeds: parser.numEmbeds(),
        compatMode: parser.compatMode(),
        contentType: parser.contentType(),
        charSet: parser.characterSet(),
        importedFonts: parser.numImportedFonts(),
        charCounts: parser.getCharCount(),
    }

    createSong(htmlData);

    let songInfo = await songBuilder.getSongInfo();

    //output to index.html
    document.getElementById("key").innerHTML = songInfo.key;
    document.getElementById("bpm").innerHTML = songInfo.bpm;
    document.getElementById("meter").innerHTML = songInfo.meter;
    document.getElementById("measures").innerHTML = songInfo.measures;
    document.getElementById("status").innerHTML = "No";

    
    
    
    /*document.getElementById("url").innerHTML = "<b>URL: </b>" + parser.getURL();
    document.getElementById("title").innerHTML = "<b>TITLE: </b>" + parser.getTitle();
    document.getElementById("num-links").innerHTML = "<b>NUMBER OF LINKS: </b>" + parser.numLinks();
    document.getElementById("num-images").innerHTML = "<b>NUMBER OF IMAGES: </b>" + parser.numImages();
    document.getElementById("num-embeds").innerHTML = "<b>NUMBER OF EMBEDS: </b>" + parser.numEmbeds();
    document.getElementById("compat-mode").innerHTML = "<b>COMPATABILITY MODE: </b>" + parser.compatMode();
    document.getElementById("content-type").innerHTML = "<b>CONTENT TYPE: </b>" + parser.contentType();
    document.getElementById("char-set").innerHTML = "<b>CHARACTER SET: </b>" + parser.characterSet();
    document.getElementById("num-imported-fonts").innerHTML = "<b>NUMBER OF IMPORTED FONTS: </b>" + parser.numImportedFonts();
    document.getElementById("character-counts").innerHTML = parser.printCharCount();
    document.getElementById("html").textContent = parser.getHTML();*/
});


document.getElementById("play-button").addEventListener("click", async function(){
    songBuilder.play();
    document.getElementById("status").innerHTML = "Yes";
});

document.getElementById("stop-button").addEventListener("click", function() {
    songBuilder.stop();
    document.getElementById("status").innerHTML = "No";
});

//create song method
function createSong(htmlData) {
    songBuilder.createSong(htmlData);
}