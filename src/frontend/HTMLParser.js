
const SERVER_URL = "http://localhost:5001";


class HTMLParser {

    html;
    doc;
    parser = new DOMParser();

    //gets html for url from python server and stores it in member variable html
    async fetchHTML(url) {
        const response = await fetch(SERVER_URL + "/fetch-html?url=" + url);
        this.html = await response.text();
        this.doc = this.parser.parseFromString(this.html, "text/html")
    }

}

export default HTMLParser;