import { initStrudel,
    hush,
    note,
    stack,
    sound,
 } from '@strudel/web';

class SongBuilder {

    //strudel
    isReady = false;

    //patterns
    patterns = []
    song;

    //song data
    tempo;
    beatsPerBar;

    //html data
    docURL;
    docTitle;
    charCounts; //map
    numLinks;
    numImages;
    numEmbeds;
    compatMode;
    contetType;
    charSet;
    importedFonts;

    //seeds
    OFFSET;
    DRUM_SEED;
    MELODY_SEED;
    CHORD_SEED;
    TEMPO_SEED;
    KEY_SIGNATURE_SEED;

    //instrument arrays:
    drumSounds = ["~", "bd", "sd", "rim", "oh", "lt", "mt", "ht", "rd", "cr"];



    //FUNCTIONS:
    /**************************************************************/



    //CONSTRUCTORS
    constructor() {
        this.initialize();
    }

    async initialize() {
        await initStrudel();
        this.isReady = true;
    }



    //UTILITY
    stringToAscii(word) {

        let sum = 0;

        for (let i = 0; i < word.length; i++) {
            sum += word.charCodeAt(i);
        }

        return sum;
    }

    getHTMLData(htmlData) {
        this.docURL = htmlData.url;        
        this.docTitle = htmlData.title;
        this.charCounts = htmlData.charCounts;
        this.numLinks = htmlData.numLinks;
        this.numImages = htmlData.numImages;
        this.numEmbeds = htmlData.numEmbeds;
        this.compatMode = htmlData.compatMode;
        this.charSet = htmlData.charSet;
        this.importedFonts = htmlData.importedFonts;
    }



    //SETTERS
    setTempo() {
        this.tempo = this.TEMPO_SEED % 300;
    }

    setBeatsPerBar() {
        this.beatsPerBar = (this.KEY_SIGNATURE_SEED % 6) + 3;
    }



    //SEED GENERATION
    setSeeds() {

        //Seed Formula: The number of occurrences in the html of a character decided by "SomeHtmlProperty % NumberOfUniqueCharacters"

        const chars = Object.keys(this.charCounts);
        const numChars = chars.length;

        //mod to prevent overflow
        this.OFFSET = this.stringToAscii(this.docURL) % 10000000;
        
        const drumIndex = this.numLinks % numChars;
        const melodyIndex = this.numImages % numChars;
        const chordIndex = this.docURL.length % numChars;
        const tempoIndex = this.docTitle.length % numChars;
        const keyIndex = this.charSet.length % numChars;
        
        const drumCount = this.charCounts[chars[drumIndex]];
        const melodyCount = this.charCounts[chars[melodyIndex]];
        const chordCount = this.charCounts[chars[chordIndex]];
        const tempoCount = this.charCounts[chars[tempoIndex]];
        const keySignatureCount = this.charCounts[chars[keyIndex]];
                
        this.DRUM_SEED = drumCount * (this.OFFSET);
        this.MELODY_SEED = melodyCount * (this.OFFSET);
        this.CHORD_SEED = chordCount * (this.OFFSET);
        this.TEMPO_SEED = tempoCount * (this.OFFSET);
        this.KEY_SIGNATURE_SEED = keySignatureCount * (this.OFFSET);

        console.log("Offset: ", this.OFFSET);
        console.log("Drum Seed: ", this.DRUM_SEED);
        console.log("Melody Seed: ", this.MELODY_SEED);
        console.log("Chord Seed: ", this.CHORD_SEED);
        console.log("Tempo Seed: ", this.TEMPO_SEED);
        console.log("Key Signature Seed: ", this.KEY_SIGNATURE_SEED);
    }



    //PATTERN GENERATION
    generateDrums() {

    }



    //PATTERN HANDLING
    appendPattern(newPattern) {
        console.log("appendPattern called");

        if (newPattern === null)
            return;

        this.patterns.push(newPattern);
    }

    buildPatterns() {
        //call pattern constructors, each of which will create a new pattern and append it to patterns
    }

    combinePatterns() {
        console.log("combinePatterns called");
        this.song = stack(...this.patterns).cpm(this.tempo / this.beatsPerBar);

        console.log("Num Patterns: ", this.patterns.length)
    }

    createSong(htmlData) {
        console.log("createSong called");

        this.getHTMLData(htmlData);
        this.setSeeds();
        //this.buildPatterns();
        //this.combinePatterns();
    }


    
    //START AND STOP
    play() {

        if (this.isReady === false) {
            console.log("Strudel Not Initalized");
            return;
        }

        if (!this.song) {
            console.error("Error: No song created. Unable to play.");
            return;
        }
        this.song.play();
        console.log("play called");
    }

    stop() {
        hush();
    }

}

export default SongBuilder;