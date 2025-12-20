

export default class HTMLParser {

    htmlString;
    parser = new DOMParser();
    doc;

    constructor(url) {
        this.setHTMLString(url);
    }


    async getHTMLDocument(url) {
        try {
        
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`The response was not okay. Error code ${response.status}`)
            }

            this.htmlString = await response.text();
            this.doc = this.parser.parseFromString(this.htmlString, "text/html");
            return this.doc;

        } catch (error) {
            console.error("Failed to fetch HTML: ", error);
        }
    }

    getHTMLString() {
        return this.htmlString;
    }

}