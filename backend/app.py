from flask import Flask, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/fetch-html")
def fetchHTML():
    print("REQUEST RECEIVED")
    url = request.args.get('url')
    print(f"FETCHING URL: {url}")

    headers = {
        'User-Agent' : 'HTML-To-Music'
    }

    response = requests.get(url, headers=headers)
    return response.text
    

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)