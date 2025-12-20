

class HTMLParser {

    htmlString;
    parser = new DOMParser();
    doc;

    HTMLParser(url) {
        this.setHTMLString(url);
    }


    async setHTMLString(url) {
        try {
        
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`The response was not okay. Error code ${response.status}`)
            }

            this.htmlString = await response.text();
            this.doc = this.parser.parseFromString(this.htmlString, "text/html");

        } catch (error) {
            console.error("Failed to fetch HTML: ", error);
        }
    }

    getHTMLString() {
        return this.htmlString;
    }

}