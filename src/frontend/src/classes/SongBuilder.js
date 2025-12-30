import { initStrudel,
    hush,
 } from '@strudel/web';

class SongBuilder {

    pattern;

    constructor() {
        initStrudel();
    }

    setPattern() {
        this.pattern = note("c3 e3 g3 c4").s("sawtooth");
    }

    setTempo(tempo) {
        this.pattern = this.pattern.cpm(tempo / 4);
    }

    play() {
        if (!this.pattern) {
            console.error("Error: No pattern created. Unable to play.");
            return;
        }
        this.pattern.play();
    }

    stop() {
        hush();
    }

}

export default SongBuilder;