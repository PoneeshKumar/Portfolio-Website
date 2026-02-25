## Portfolio Website

This is a personal portfolio for a University of Waterloo CS + Finance student targeting quantitative finance and software engineering co-ops. It is built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

### Scripts

- **Install dependencies**

```bash
npm install
```

- **Run the dev server**

```bash
npm run dev
```

Then open the printed URL in your browser (typically `http://localhost:5173`).

- **Build for production**

```bash
npm run build
```

### Custom Features

- **Scrolling market + developer ticker** at the top of the site (simulated data, but motion and styling match real finance terminals).
- **Hero section** tuned for Waterloo + quant finance, explaining how you bridge code and capital.
- **Stories, Projects, Resume Hub, and Contact** sections laid out as a single, responsive page.

### What I Made
A high-performance personal brand site and digital terminal designed to showcase the intersection of code and capital markets. 
  Live Financial Ticker: Real-time data streaming of global indices ($S\&P$ 500, $Nasdaq$) and bond yields using a Vercel Serverless Proxy to handle API requests.
  Dual-Track Strategy: A unique "Resume Hub" with separate profiles for Software Engineering and Quantitative Finance, allowing for targeted co-op applications.
  Stack: Built with React, TypeScript, and Tailwind CSS, deployed via Vercel with a custom serverless backend.


### Why I Made It
As a first year CFM student, I realized that my two interests, algorithmic trading and Finance often exist in silos. I wanted a platform that didn't just list my skills, but demonstrated them. I needed a way to prove that I could handle the CORS challenges of financial data APIs while maintaining a professional, finance-first aesthetic. Additionally, I wanted to make something that was able to showcase me in a more creative way rather then just a resume or cover letter!

### What I Originally Thought
I originally thought building a portfolio was just about making a pretty website with some links. I planned to hit the Yahoo Finance API directly from the frontend and just hardcode my About Me stories. I figured the most difficult part would be the CSS animations for the scrolling ticker.

### What Actually Happened
The CORS Wall: I quickly hit a security wall, browsers block direct requests to Yahoo Finance to prevent spam.
The Tag Tangling Crisis: During development, I accidentally nested several <section> tags, which caused my production builds to fail with Command "npm run build" exited with 2.
File Sync Issues: I struggled to get my PDF resumes to appear on the live site because they were being ignored by Git or named with inconsistent casing that Linux servers couldn't find.

### What I Took Away
1. Backend is Mandatory: Even for a frontend portfolio, understanding Serverless Functions is essential for handling secure data flows and bypassing browser restrictions.
2. Latency Matters: I learned to optimize for sub-second load times. In fintech, if the data is slow, it's useless.
3. The Developer Mindset: I moved from just making it work to engineering for failure. I implemented static fallbacks for my ticker so the site remains functional even if the live API is down.

I am always looking for ways to improve, so if you see something I could work on for my next project, do let me know!
