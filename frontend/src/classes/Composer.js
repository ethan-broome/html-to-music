class Composer {
  //song data
  songData = {
    tempo: 0,
    beatsPerBar: 0,
    key: "",
    progression: [],
    numBars: 0,
    rootnote: "",
  };

  //weights
  drumWeights = {
    hihats: 0.7,
    bassdrum: 0.4,
    snare: 0.25,
  };

  drumEffects = {
    lowpass: 0.25,
    highpass: 0.25,
    bandpass: 0.25,
    vowel: 0.1,
    room: 0.5,
    delay: 0.3,
    bitcrush: 0.15,
    tremolo: 0.2,
    attack: 0.2,
    decay: 0.2,
    sustain: 0.2,
    release: 0.2,
  };

  chordEffects = {
    lowpass: 0.35,
    highpass: 0.35,
    bandpass: 0.35,
    vowel: 0.3,
    room: 0.6,
    delay: 0.5,
    bitcrush: 0.3,
    tremolo: 0.3,
    attack: 0.3,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  };

  melodyEffects = {
    lowpass: 0.35,
    highpass: 0.35,
    bandpass: 0.35,
    vowel: 0.5,
    room: 0.6,
    delay: 0.6,
    bitcrush: 0.3,
    tremolo: 0.3,
    attack: 0.4,
    decay: 0.4,
    sustain: 0.4,
    release: 0.4,
  };

  //strudel arrays:
  /***************/

  //strudel library scales: (issue with #)
  scales = [
    "pentatonic",
    "major",
    "minor",
    "major:blues",
    "minor:blues",
    "melodic:minor",
    "harmonic:minor",
    "bebop",
    "diminished",
    "dorian",
    "lydian",
    "mixolydian",
    "phrygian",
    "locrian",
    "ionian:pentatonic",
    "mixolydian:pentatonic",
    "ritusen",
    "egyptian",
    "neopolitan:major:pentatonic",
    "vietnamese:1",
    "pelog",
    "kumoijoshi",
    "hirajoshi",
    "iwato",
    "in-sen",
    "lydian:pentatonic",
    "malkos:raga",
    "locrian:pentatonic",
    "minor:pentatonic",
    "minor:six:pentatonic",
    "flat:three:pentatonic",
    "flat:six:pentatonic",
    "scriabin",
    "whole:tone:pentatonic",
    //"lydian:#5P:pentatonic",
    "lydian:dominant:pentatonic",
    //"minor:#7M:pentatonic",
    "super:locrian:pentatonic",
    "minor:hexatonic",
    "augmented",
    "piongio",
    "prometheus:neopolitan",
    "prometheus",
    //"mystery:#1",
    "six:tone:symmetric",
    "whole:tone",
    //"messiaen's:mode:#5",
    "locrian:major",
    "double:harmonic:lydian",
    "altered",
    "half-diminished",
    "hindu",
    "overtone",
    "lydian:augmented",
    "dorian:b2",
    "ultralocrian",
    "locrian:6",
    "altered:dorian",
    "lydian:diminished",
    "leading:whole:tone",
    "lydian:minor",
    "spanish",
    "balinese",
    "neopolitan:major",
    "harmonic:major",
    "gypsy",
    "hungarian:minor",
    "hungarian:major",
    "oriental",
    "flamenco",
    "todi:raga",
    "persian",
    "enigmatic",
    "major:augmented",
    //"lydian:#9", "messiaen's:mode:#4",
    "purvi:raga",
    "spanish:heptatonic",
    "bebop:minor",
    "bebop:major",
    "bebop:locrian",
    "minor:bebop",
    "ichikosucho",
    "minor:six:diminished",
    "half-whole:diminished",
    "kafi:raga",
    //"messiaen's:mode:#6",
    "composite:blues",
    //"messiaen's:mode:#3", "messiaen's:mode:#7",
    "chromatic",
  ];
  keys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  vowels = ["a", "e", "i", "o", "u"];

  compose(seeds) {
    this.seeds = seeds;

    this.setTempo();
    this.setBeatsPerBar();
    this.setKey();
    this.setChordProgression();

    return [this.generateDrums(), this.generateMelody(), this.generateChords()];
  }

  mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);

      t = Math.imul(t ^ (t >>> 15), t | 1);

      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  seededRandomInt(random, max) {
    return Math.floor(random() * max);
  }

  setTempo() {
    this.songData.tempo = this.seeds.TEMPO_SEED % 300;

    if (this.songData.tempo < 100) this.songData.tempo += 100;
  }

  setBeatsPerBar() {
    this.songData.beatsPerBar = (this.seeds.TIME_SIGNATURE_SEED % 6) + 3;
  }

  setKey() {
    let random = this.mulberry32(this.seeds.CHORD_SEED);

    this.songData.key =
      this.keys[this.seededRandomInt(random, this.keys.length)];

    this.songData.rootnote = this.songData.key + "4";

    this.songData.key +=
      ":" + this.scales[this.seededRandomInt(random, this.scales.length)];
  }

  setChordProgression() {
    this.songData.progression.length = 0;

    let numChords = this.seeds.CHORD_SEED % 16 || 1;

    let random = this.mulberry32(this.seeds.CHORD_SEED + 1000);

    for (let i = 0; i < numChords; i++) {
      this.songData.progression.push(this.seededRandomInt(random, 8));
    }

    this.songData.numBars = this.songData.progression.length;
  }

  generateDrums() {
    let random = this.mulberry32(this.seeds.DRUM_SEED);

    const hhPattern = Array.from(
      {
        length: this.songData.beatsPerBar,
      },
      () => (random() < this.drumWeights.hihats ? 1 : 0),
    );

    const bdPattern = Array.from(
      {
        length: this.songData.beatsPerBar,
      },
      () => (random() < this.drumWeights.bassdrum ? 1 : 0),
    );

    const sdPattern = Array.from(
      {
        length: this.songData.beatsPerBar,
      },
      () => (random() < this.drumWeights.snare ? 1 : 0),
    );

    return {
      type: "drums",

      patterns: {
        hihat: hhPattern.join(" "),

        bass: bdPattern.join(" "),

        snare: sdPattern.join(" "),
      },

      effects: this.drumEffects,

      seed: this.seeds.DRUM_SEED,
    };
  }

  generateMelody() {
    let notes = "";

    let random = this.mulberry32(this.seeds.MELODY_SEED);

    for (let j = 0; j < this.songData.numBars; j++) {
      let root = this.songData.progression[j];

      for (let i = 0; i < this.songData.beatsPerBar; i++) {
        let r = random();

        if (r < 0.5) notes += "~ ";
        else if (r < 0.6) notes += root + " ";
        else if (r < 0.7) notes += root + 2 + " ";
        else if (r < 0.8) notes += root + 4 + " ";
        else if (r < 0.9) notes += root + 6 + " ";
        else notes += this.seededRandomInt(random, 8) + " ";
      }
    }

    return {
      type: "melody",

      notes,

      scale: this.songData.key,

      length: this.songData.numBars,

      instrument: "sax",

      effects: this.melodyEffects,

      seed: this.seeds.MELODY_SEED,
    };
  }

  generateChords() {
    let chords = this.songData.progression.map((degree) => {
      return [degree, degree + 2, degree + 4];
    });

    return {
      type: "chords",

      chords,

      scale: this.songData.key,

      instrument: "sawtooth",

      effects: this.chordEffects,

      seed: this.seeds.CHORD_SEED,
    };
  }
}

export default Composer;
