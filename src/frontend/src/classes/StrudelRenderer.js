import { stack, s, n } from "@strudel/web";

class StrudelRenderer {
  render(composition, tempo, beatsPerBar) {
    let patterns = [];

    composition.forEach((element) => {
      if (element.type === "drums") {
        let hihat = s("hh").struct(element.patterns.hihat);

        let bass = s("bd").struct(element.patterns.bass);

        let snare = s("sd").struct(element.patterns.snare);

        patterns.push(stack(hihat, bass, snare));
      } else if (element.type === "melody") {
        let melody = n(element.notes)
          .scale(element.scale)
          .slow(element.length)
          .sound(element.instrument);

        melody = this.addEffects(melody, element.seed, element.effects);

        patterns.push(melody);
      } else if (element.type === "chords") {
        let chordString = element.chords
          .map((chord) => {
            return `[${chord.join(",")}]`;
          })
          .join(" ");

        let chords = n(`<${chordString}>`)
          .scale(element.scale)
          .sound(element.instrument);

        chords = this.addEffects(chords, element.seed, element.effects);

        patterns.push(chords);
      }
    });

    return stack(...patterns).cpm(tempo / beatsPerBar);
  }

  addEffects(pattern, seed, weights) {
    let random = this.mulberry32(seed);

    if (random() < weights.lowpass) {
      pattern = pattern.lpf(500 + random() * 2000);
    } else if (random() < weights.highpass) {
      pattern = pattern.hpf(50 + random() * 450);
    } else if (random() < weights.bandpass) {
      pattern = pattern.bpf(200 + random() * 1800);
    }

    if (random() < weights.room) {
      pattern = pattern.room(random());
    }

    if (random() < weights.delay) {
      pattern = pattern.delay(random());
    }

    if (random() < weights.bitcrush) {
      pattern = pattern.coarse(Math.floor(random() * 32));
    }

    return pattern;
  }

  mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);

      t = Math.imul(t ^ (t >>> 15), t | 1);

      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}

export default StrudelRenderer;
