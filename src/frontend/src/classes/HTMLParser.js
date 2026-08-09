
const SERVER_URL = "http://localhost:5001";


class HTMLParser {

    #url;
    #html;
    #doc;
    #parser = new DOMParser();

    #charCount

    //gets html for url from python server and stores it in member variable html
    async fetchHTML(inputURL) {
        const response = await fetch(SERVER_URL + "/fetch-html?url=" + inputURL);
        this.#url = inputURL
        this.#html = await response.text();
        this.#doc = this.#parser.parseFromString(this.#html, "text/html")
        this.#charCount = this.getCharCount();
    }

    getTitle() {
        return this.#doc.title;
    }

    getURL() {
        return this.#url;
    }

    getHTML() {
        return this.#html;
    }

    numLinks() {
        return this.#doc.links.length;
    }

    numImages() {
        return this.#doc.images.length;
    }

    numEmbeds() {
        return this.#doc.embeds.length;
    }

    compatMode() {
        return this.#doc.compatMode;
    }

    contentType() {
        return this.#doc.contentType;
    }

    characterSet() {
        return this.#doc.characterSet;
    }

    numImportedFonts() {
        return this.#doc.fonts.size;
    }

    getCharCount() {

        const counts = {};

        for (let char of this.#html) {
            counts[char] = (counts[char] || 0) + 1;
        }

        return counts;
    }

    printCharCount() {
        let countsTable = "<table border = '1'><tr><th>CHARACTER</th><th>COUNT</th></tr>";
        for (let char in this.#charCount) {
            const displayChar = char === ' ' ? 'space' :
                                char === '\n' ? '\\n' :
                                char === '\t' ? '\\t' : char;
            countsTable += `<tr><td>${displayChar}</td><td>${this.#charCount[char]}</td></tr>`;
        }
        countsTable += "</table>";

        return countsTable;
    }
}

export default HTMLParser;