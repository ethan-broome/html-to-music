import { initStrudel, samples } from "@strudel/web";
import StrudelRenderer from "./StrudelRenderer";
import SeedGenerator from "./SeedGenerator";
import Composer from "./Composer";
import AudioPlayer from "./AudioPlayer";

class SongBuilder {
  //renderer
  renderer = new StrudelRenderer();

  //seed generator
  seedGenerator = new SeedGenerator();

  //composer
  composer = new Composer();

  //audio player
  audioPlayer = new AudioPlayer();

  //patterns
  composition = [];
  song;

  //html data
  htmlData = {
    docURL: "",
    docTitle: "",
    charCounts: {},
    numLinks: 0,
    numImages: 0,
    numEmbeds: 0,
    compatMode: "",
    contentType: "",
    charSet: "",
    importedFonts: [],
  };

  //FUNCTIONS:
  /**************************************************************/

  //CONSTRUCTORS
  constructor() {
    this.initialize();
  }

  async initialize() {
    await initStrudel();

    samples("github:tidalcycles/dirt-samples");

    this.isReady = true;
  }

  //UTILITY
  getHTMLData(htmlData) {
    this.htmlData = {
      docURL: htmlData.url,
      docTitle: htmlData.title,
      charCounts: htmlData.charCounts,
      numLinks: htmlData.numLinks,
      numImages: htmlData.numImages,
      numEmbeds: htmlData.numEmbeds,
      compatMode: htmlData.compatMode,
      charSet: htmlData.charSet,
      importedFonts: htmlData.importedFonts,
    };
  }

  //PATTERN HANDLING
  combinePatterns() {
    console.log("combinePatterns called");
    this.song = this.renderer.render(
      this.composition,
      this.composer.songData.tempo,
      this.composer.songData.beatsPerBar,
    );

    console.log("Num Patterns: ", this.composition.length);
  }

  createSong(htmlData) {
    console.log("createSong called");

    this.getHTMLData(htmlData);
    this.seeds = this.seedGenerator.generate(this.htmlData);

    this.composition = this.composer.compose(this.seeds);
    this.combinePatterns();
  }

  getSongInfo() {
    let info = {
      key: this.composer.songData.key.replaceAll(":", " "),
      bpm: this.composer.songData.tempo,
      meter: this.composer.songData.beatsPerBar + "/4",
      measures: this.composer.songData.numBars,
    };

    return info;
  }

  play() {
    if (!this.isReady) {
      console.log("Strudel not ready");
      return;
    }

    this.audioPlayer.play(this.song);
  }

  stop() {
    this.audioPlayer.stop();
  }
}

export default SongBuilder;
