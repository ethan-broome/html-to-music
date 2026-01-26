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
    progression = [];
    numBars;
    rootnote;

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
    TIME_SIGNATURE_SEED;

    //weights
    drumWeights = {
        hihats : 0.7,
        bassdrum : 0.4,
        snare : 0.25
    }

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
            "ultralocrian", "locrian:6", "altered:dorian", "lydian:diminished", "leading:whole:tone",
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

    vowels = ["a", "e", "i", "o", "u"];

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


    //used for random float between 0 and 1
    mulberry32(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    //used alongside mulberry 32 to generate random int, pass in mulberry32 function object and max value
    seededRandomInt(random, max) {
        return Math.floor(random() * max);
    }



    //SETTERS
    setTempo() {
        this.tempo = this.TEMPO_SEED % 300;
        if (this.tempo < 100)
            this.tempo += 100;
        console.log("Tempo: " + this.tempo);
    }

    setBeatsPerBar() {
        this.beatsPerBar = (this.TIME_SIGNATURE_SEED % 6) + 3;
        console.log("Beats Per Bar: " + this.beatsPerBar);
    }

    setKey() {
        let random = this.mulberry32(this.CHORD_SEED);

        this.key = this.keys[this.seededRandomInt(random, this.keys.length)];
        this.rootnote = this.key + "4";
        this.key += ":" + this.scales[this.seededRandomInt(random, this.scales.length)];
        console.log("Key: " + this.key);
    }

    setChordProgression() {
        this.progression.length = 0;
        let numChords = this.CHORD_SEED % 16 || 1;
        let random = this.mulberry32(this.CHORD_SEED + 1000);

        for (let i = 0; i < numChords; i++) {
            this.progression.push(this.seededRandomInt(random, 8));
        }

        this.numBars = this.progression.length;

        console.log("Chord Progression: " + this.progression);
        console.log("Length of Song: " + this.numBars + (" bars"));
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
        this.TIME_SIGNATURE_SEED = keySignatureCount * (this.OFFSET);

        console.log("Offset: ", this.OFFSET);
        console.log("Drum Seed: ", this.DRUM_SEED);
        console.log("Melody Seed: ", this.MELODY_SEED);
        console.log("Chord Seed: ", this.CHORD_SEED);
        console.log("Tempo Seed: ", this.TEMPO_SEED);
        console.log("Key Signature Seed: ", this.TIME_SIGNATURE_SEED);
    }



    //PATTERN GENERATION
    generateDrums() {
        let random = this.mulberry32(this.DRUM_SEED);

        const hhPattern = Array.from({length: this.beatsPerBar}, () => random() < this.drumWeights.hihats ? 1 : 0);
        const bdPattern = Array.from({length: this.beatsPerBar}, () => random() < this.drumWeights.bassdrum ? 1 : 0);
        const sdPattern = Array.from({length: this.beatsPerBar}, () => random() < this.drumWeights.snare ? 1 : 0);

        let hihats = s("hh").struct(hhPattern.join(' '));
        let bassdrum = s("bd").struct(bdPattern.join(' '));
        let snare = s("sd").struct(sdPattern.join(' '));

        let drums = stack(hihats, bassdrum, snare);

        drums = this.addEffects(drums, this.DRUM_SEED);

        this.appendPattern(drums);
    }

    generateMelody() {
        let notes = "";
        for (let j = 0; j < this.numBars; j++) {
            let root = this.progression[j];
            for (let i = 0; i < this.beatsPerBar; i++) {
                notes += (root + " ");
                root += 1;
            }
        }

        let pattern = n(notes).scale(this.key).slow(this.numBars).sound("sax");
        this.appendPattern(pattern);
    }

    generateChords() {
        let chordNotes = this.progression.map(degree => {
            return `[${degree}, ${degree + 2}, ${degree + 4}]`;
        }).join (" ");

        let pattern = n(`<${chordNotes}>`).scale(this.key);

        let random = this.mulberry32(this.CHORD_SEED + 500);

        //sounds
        if (random() < 0.2) {
            pattern = pattern.sound("pluck");
            console.log("Pluck Sound Applied!");
        }

        else if (random() < 0.2) {
            pattern = pattern.sound("newnotes");
            console.log("New Notes Sound Applied!");
        }

        pattern = this.addEffects(pattern, this.CHORD_SEED);

        this.appendPattern(pattern);
    }

    //PATTERN EFFECTS
    addEffects(pattern, seed) {

        let random = this.mulberry32(seed);

        if (random() < 0.5) {
            pattern = pattern.lpf(500 + random() * 2000);
            console.log("Low Pass Filter Applied!");
        }

        else if (random() < 0.5) {
            pattern = pattern.hpf(50 + random() * 450);
            console.log("High Pass Filter Applied!");
        }

        else if (random() < 0.5) {
            pattern = pattern.bpf(200 + random() * 1800)
            console.log("Band Pass Filter Applied!");
        }

        if (random() < 0.3) {
            pattern = pattern.vowel(this.vowels[this.seededRandomInt(random, this.vowels.length)])
        }

        if (random() < 0.5) {
            pattern = pattern.room(random());
            console.log("Reverb Applied!");
        }

        if (random() < 0.5) {
            pattern = pattern.delay(random());
            console.log("Delay Applied!");
        }

        if (random() < 0.3) {
            pattern = pattern.coarse(this.seededRandomInt(random, 32));
            console.log("Bit Crush Applied!");
        }

        if (random() < 0.3) {
            pattern = pattern.tremolosync(this.beatsPerBar);
            console.log("Tremolo Sync Applied!");
        }

        if (random() < 0.3) {
            pattern = pattern.attack(random());
            console.log("Attack Modified!");
        }

        if (random() < 0.3) {
            pattern = pattern.decay(random());
            console.log("Decay Modified!");
        }

        if (random() < 0.3) {
            pattern = pattern.sustain(random());
            console.log("Sustain Modified!");
        }

        if (random() < 0.3) {
            pattern = pattern.release(random());
            console.log("Release Modified!");
        }

        return pattern;
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
        this.setChordProgression();
        this.generateChords();
        //this.generateMelody();
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