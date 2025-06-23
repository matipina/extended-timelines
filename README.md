# Extended Timelines

Extended Timelines is an interactive, AI-powered web app for generating, exploring, and remixing historical timelines of Wikipedia articles. Built with Vue 3 and Vite, it leverages the Gemini API to create rich, event-based timelines and concise summaries for any topic.

## Features

- **AI-Generated Timelines:**
  - Fetches random Wikipedia articles and generates detailed timelines of key events using the Gemini API.
  - Only displays articles with meaningful, event-rich timelines (filters out empty results).

- **Interactive Timeline Navigation:**
  - Scrollable, visually engaging timeline with event highlights.
  - Clickable events for focused exploration.
  - Modern, responsive UI with smooth transitions and polished design.

- **Summary & Article Info:**
  - AI-generated summary for each article, always visible alongside the timeline.
  - Prominent article title and direct Wikipedia link.

- **Remix & Extend:**
  - "Remix" button generates a new, alternative timeline for the same article.
  - "Extend Past" and "Extend Future" buttons let you add more events before or after the current timeline, powered by AI.
  - Spinners and indicators show exactly where new events will appear.

- **Smart Article Selection:**
  - Navbar shows at least 7 articles with valid timelines, fetching more as needed.
  - Pointer/arrow indicators highlight the selected article.
  - Minimalistic refresh button for new article sets.

- **Performance & UX:**
  - Caches generated timelines and remixes for fast navigation.
  - Loading and fallback states are clearly indicated with spinners and color cues.
  - All UI elements are aligned for a clean, modern look.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/matipina/extended-timelines.git
   cd extended-timelines
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up your API key:**
   - Copy `.env.example` to `.env` and add your Gemini API key.
   - **Never commit your `.env` file!**
4. **Run the app locally:**
   ```sh
   npm run dev
   ```
5. **Open in your browser:**
   - Visit `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

- `src/` — Main Vue components and assets
- `api/` — Serverless functions for timeline generation, remixing, and extension
- `public/` — Static assets

## Contributing
Pull requests and suggestions are welcome! Please open an issue to discuss major changes first.

## License
MIT
