import { initStrudel,
    hush,
    note,
    stack,
    sound,
    samples,
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
    key;

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

    //strudel arrays:
    /***************/

    //strudel library scales: (issue with #)
    scales = ["pentatonic", "major", "minor", "major:blues", "minor:blues",
            "melodic:minor", "harmonic:minor", "bebop", "diminished", "dorian",
            "lydian", "mixolydian", "phrygian", "locrian", "ionian:pentatonic", 
            "mixolydian:pentatonic", "ritusen", "egyptian", "neopolitan:major:pentatonic",
            "vietnamese:1", "pelog", "kumoijoshi", "hirajoshi", "iwato",
            "in-sen", "lydian:pentatonic", "malkos:raga", "locrian:pentatonic", "minor:pentatonic",
            "minor:six:pentatonic", "flat:three:pentatonic", "flat:six:pentatonic", "scriabin",
            "whole:tone:pentatonic", 
            //"lydian:#5P:pentatonic", 
            "lydian:dominant:pentatonic", 
            //"minor:#7M:pentatonic", 
            "super:locrian:pentatonic", "minor:hexatonic", "augmented",
            "piongio", "prometheus:neopolitan", "prometheus", 
            //"mystery:#1", 
            "six:tone:symmetric",
            "whole:tone", 
            //"messiaen's:mode:#5", 
            "locrian:major", "double:harmonic:lydian", 
            "altered", "half-diminished", "hindu", "overtone", "lydian:augmented", "dorian:b2",
            "ultralocrian", "locrain:6", "altered:dorian", "lydian:diminished", "leading:whole:tone",
            "lydian:minor", "spanish", "balinese", "neopolitan:major", "harmonic:major", 
            "gypsy", "hungarian:minor", "hungarian:major", "oriental", "flamenco", "todi:raga",
            "persian", "enigmatic", "major:augmented", 
            //"lydian:#9", "messiaen's:mode:#4",
            "purvi:raga", "spanish:heptatonic", "bebop:minor", "bebop:major", "bebop:locrian",
            "minor:bebop", "ichikosucho", "minor:six:diminished", "half-whole:diminished", "kafi:raga",
            //"messiaen's:mode:#6", 
            "composite:blues", 
            //"messiaen's:mode:#3", "messiaen's:mode:#7", 
            "chromatic"
    ]
    keys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

    //drum sounds are incomplete
    drumSounds = ["bd", "sd", "lt", "mt", "ht", "cr"];



    //FUNCTIONS:
    /**************************************************************/



    //CONSTRUCTORS
    constructor() {
        this.initialize();
    }

    async initialize() {
        await initStrudel();
        samples('github:tidalcycles/dirt-samples');
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

    getNextNumber(seed) {
        let newSeed;
        newSeed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
        return newSeed;
    }



    //SETTERS
    setTempo() {
        this.tempo = this.TEMPO_SEED % 300;
        console.log("Tempo: " + this.tempo);
    }

    setBeatsPerBar() {
        this.beatsPerBar = (this.KEY_SIGNATURE_SEED % 6) + 3;
        console.log("Beats Per Bar: " + this.beatsPerBar);
    }

    setKey() {
        let seed = this.getNextNumber(this.CHORD_SEED);
        this.key = "";
        this.key += this.keys[seed % this.keys.length];
        this.key += ":";
        seed = this.getNextNumber(seed);
        this.key += this.scales[seed % this.scales.length];
        console.log("Key: " + this.key);
    }



    //SEED GENERATION
    setSeeds() {

        //Seed Formula: The number of occurrences in the html of a character decided by "SomeHtmlProperty % NumberOfUniqueCharacters"

        const chars = Object.keys(this.charCounts).sort();
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
        let notes = "<";

        for (let i = 0; i < this.beatsPerBar * 2; i++) {
            if (this.DRUM_SEED % i === 0) 
                notes += "~ ";
            else
                notes += this.drumSounds[i % this.drumSounds.length] + " ";
        }

        notes += ">*" + (this.beatsPerBar * 4);

        let pattern = sound(notes);
        this.appendPattern(pattern);
    }

    generateMelody() {
        let notes = "";
        for (let i = 0; i < this.beatsPerBar * 2; i++) {
            notes += i + " ";
        }

        let pattern = n(notes).scale(this.key);
        this.appendPattern(pattern);
    }



    //PATTERN HANDLING
    appendPattern(newPattern) {
        console.log("appendPattern called");

        if (newPattern === null)
            return;

        this.patterns.push(newPattern);
    }

    buildPatterns() {
        this.setTempo();
        this.setBeatsPerBar();
        this.setKey();
        this.generateMelody();   
        this.generateDrums();
    }

    combinePatterns() {
        console.log("combinePatterns called");
        this.song = stack(...this.patterns).cpm(this.tempo / this.beatsPerBar);

        console.log("Num Patterns: ", this.patterns.length)
    }

    createSong(htmlData) {
        console.log("createSong called");
        this.patterns.length = 0;

        this.getHTMLData(htmlData);
        this.setSeeds();
        this.buildPatterns();
        this.combinePatterns();
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