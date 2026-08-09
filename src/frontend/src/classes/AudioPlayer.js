import { hush } from "@strudel/web";

class AudioPlayer {
  play(song) {
    if (!song) {
      console.error("No song to play");
      return;
    }

    song.play();

    console.log("play called");
  }

  stop() {
    hush();

    console.log("stop called");
  }
}

export default AudioPlayer;
