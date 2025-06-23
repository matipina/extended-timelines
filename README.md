# Extended Timelines

“Time is out of order.” This project explores how generative AI can help us reimagine the concept of non-linear time and alternate histories. By fetching random articles from Wikipedia, the app uses generative AI to create, remix, and extend timelines—revealing unexpected connections and possibilities. Each timeline is a unique, AI-generated narrative, allowing you to explore alternate versions of history and knowledge.

## Features

- **AI-Generated Timelines:**
  - Fetches random Wikipedia articles and generates detailed timelines of key events using the Gemini API.
  - Only displays articles with meaningful, event-rich timelines (filters out empty results).
- **Remix & Extend:**
  - "Remix" generates a new, alternative timeline for the same article using AI.
  - "Extend Past" and "Extend Future" add more events before or after the current timeline, powered by AI.
  - Caches generated and remixed timelines for fast navigation.
- **Smart Article Selection:**
  - Always shows at least 7 articles with valid timelines, fetching more as needed.
  - Minimalistic refresh for new article sets.
- **API-First Architecture:**
  - All timeline, remix, and extend logic is handled by serverless API endpoints (see `api/` folder).
  - Frontend and backend are fully decoupled for flexible deployment.
- **Modular Codebase:**
  - Timeline/article state and async logic are encapsulated in composables (`src/composables/useTimelineApp.js`).
  - Loading UI is handled by a reusable component (`src/components/LoadingIndicator.vue`).

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

4. **Run the app locally (with API):**
   - Install [Vercel CLI](https://vercel.com/docs/cli):

     ```sh
     npm install -g vercel
     ```

   - Start the local dev server (serves both frontend and API):

     ```sh
     vercel dev
     ```

   - Open `http://localhost:3000` (or the port shown in your terminal).

## Deployment

### Deploying the API (Vercel)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/new) and import your repo.
3. Set your Gemini API key as an environment variable in the Vercel dashboard.
4. Deploy. Your API endpoints will be available at `https://<your-vercel-app>.vercel.app/api/generateTimeline`, etc.

### Deploying the Frontend (GitHub Pages)

1. In your project root, create a `.env.production` file:

   ```sh
   VITE_API_URL=https://<your-vercel-app>.vercel.app
   ```

2. Make sure your `vite.config.js` has the correct `base` option (e.g., `/extended-timelines/`).
3. Build and deploy:

   ```sh
   npm run build
   npm run deploy
   ```

4. Enable GitHub Pages in your repo settings, set the source to the `gh-pages` branch.
5. Your app will be live at `https://<your-username>.github.io/extended-timelines/` and will use your Vercel API.

## Project Structure

- `src/` — Main Vue components, composables, and assets
- `api/` — Serverless functions for timeline generation, remixing, and extension
- `public/` — Static assets

## Contributing

Pull requests and suggestions are welcome! Please open an issue to discuss major changes first.

## License

MIT
