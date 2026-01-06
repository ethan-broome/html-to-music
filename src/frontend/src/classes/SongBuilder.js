import { initStrudel,
    hush,
    note,
    stack,
    sound,
 } from '@strudel/web';

class SongBuilder {

    //local data
    patterns = []
    song;
    tempo;
    beatsPerBar;
    isReady = false;

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
    DRUM_SEED;
    MELODY_SEED;
    CHORD_SEED;
    TEMPO_SEED;
    KEY_SIGNATURE_SEED;

    //instrument arrays:
    drumSounds = ["bd", "sd", "rim", "oh", "lt", "mt", "ht", "rd", "cr"];



    //FUNCTIONS:
    /**************************************************************/



    //constructors
    constructor() {
        this.initialize();
    }

    async initialize() {
        await initStrudel();
        this.isReady = true;
    }



    //get html data
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



    //set seeds
    setSeeds() {

        //Seed Formula: The number of occurrences in the html of a character decided by "SomeHtmlProperty % NumberOfUniqueCharacters"

        const chars = Object.keys(this.charCounts);
        const numChars = chars.length;
        
        const drumIndex = this.numLinks % numChars;
        const melodyIndex = this.numImages % numChars;
        const chordIndex = this.docURL.length % numChars;
        const tempoIndex = this.docTitle.length % numChars;
        const keyIndex = this.charSet.length % numChars;
        
        this.DRUM_SEED = this.charCounts[chars[drumIndex]];
        this.MELODY_SEED = this.charCounts[chars[melodyIndex]];
        this.CHORD_SEED = this.charCounts[chars[chordIndex]];
        this.TEMPO_SEED = this.charCounts[chars[tempoIndex]];
        this.KEY_SIGNATURE_SEED = this.charCounts[chars[keyIndex]];


        console.log("Drum Seed: ", this.DRUM_SEED);
        console.log("Melody Seed: ", this.MELODY_SEED);
        console.log("Chord Seed: ", this.CHORD_SEED);
        console.log("Tempo Seed: ", this.TEMPO_SEED);
        console.log("Key Signature Seed: ", this.KEY_SIGNATURE_SEED);
    }



    //setters
    setTempo() {
        this.tempo = this.TEMPO_SEED % 300;
    }

    setBeatsPerBar() {
        this.beatsPerBar = (this.KEY_SIGNATURE_SEED % 6) + 3;
    }



    //pattern handling
    appendPattern(tempPattern) {
        console.log("appendPattern called");

        if (tempPattern === null)
            return;

        this.patterns.push(tempPattern);
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


    
    //start and stop
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