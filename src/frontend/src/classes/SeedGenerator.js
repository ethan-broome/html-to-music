class SeedGenerator {
  stringToAscii(word) {
    let sum = 0;

    for (let i = 0; i < word.length; i++) {
      sum += word.charCodeAt(i);
    }

    return sum;
  }

  generate(htmlData) {
    const chars = Object.keys(htmlData.charCounts).sort();

    const numChars = chars.length;

    const offset = this.stringToAscii(htmlData.docURL) % 10000000;

    return {
      DRUM_SEED:
        htmlData.charCounts[chars[htmlData.numLinks % numChars]] * offset,

      MELODY_SEED:
        htmlData.charCounts[chars[htmlData.numImages % numChars]] * offset,

      CHORD_SEED:
        htmlData.charCounts[chars[htmlData.docURL.length % numChars]] * offset,

      TEMPO_SEED:
        htmlData.charCounts[chars[htmlData.docTitle.length % numChars]] *
        offset,

      TIME_SIGNATURE_SEED:
        htmlData.charCounts[chars[htmlData.charSet.length % numChars]] * offset,
    };
  }
}

export default SeedGenerator;
