# HTML to Music Converter

> **Transform webpages into music.**

This project takes the HTML of a given webpage and deterministically generates music from it. The music-generation algorithms, logic, and backend were developed by me, while the music is composed using the [Strudel](https://strudel.cc/workshop/getting-started/) JavaScript library.

---

## How Does it Work?

After you provide a URL, the software fetches the HTML, parse it for important information (such as headings, character counts, links and images, etc.), hash this data, and map it to musical values like key centers, BPM, chords, rhythm, instruments, and effects. The result is a completely deterministic "musical snapshot" of the webpage. For those interested, you could even change HTML elements to see the effects it has on the musical output.

---

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* Python 3.9+
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/ethan-broome/html-to-music.git
cd html-to-music
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

Start the backend:

```bash
python app.py
```

Start the frontend:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Current Development

### In Progress

* **Sentiment Analysis** — The next step I'm currently working on for the project is implementing a sentiment-analysis library to allow emotional weights of words to influence the music-making process in some way. This would allow the music to better reflect the data it is created from, and provide a more accurate "musical snapshot"

### Future Ideas

* Experiment with different PRNG algorithms and compare their musical effects
* Allow users to choose which HTML elements map to which musical elements
