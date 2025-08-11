# NextGenXplorer

> Charting the course of tomorrow's technology, today.

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue)](https://www.npmjs.com/package/nextn) [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Netlify Status](https://api.netlify.com/api/v1/badges/ea28765b-ed2e-446e-9d83-898a1aaf5b90/deploy-status)](https://app.netlify.com/projects/nextgenxplorer/deploys) [![Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?logo=next.js)](https://nextjs.org) [![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

Welcome to the official repository for **NextGenXplorer**, a digital think tank and media hub dedicated to exploring the future of technology and its impact on our world.


## Our Mission

Our mission is to decode the future. We dissect and debate the technological forces—from artificial intelligence to quantum leaps—that are actively reshaping our world and defining the next chapter of human history. We produce visually striking, deeply researched content that demystifies the complex and provokes critical thought.

## Key Features

- **Dynamic Content:** All application content is managed through centralized JSON files (`src/data/content.json` and `src/data/videos.json`), making updates simple and straightforward.
- **Automatic Video Details:** The app automatically fetches video titles, descriptions, and thumbnails from YouTube, so you only need to provide the video URL.
- **Responsive Design:** A modern, mobile-first design that ensures a seamless experience across all devices.
- **Themed UI:** Built with a sleek, customizable dark/light mode toggle.
- **Video Archives:** A dedicated section to explore our full repository of video content.
- **Developer-Friendly:** Built with a modern tech stack for a robust and maintainable codebase.

## Tech Stack

This project is built with a curated selection of modern technologies:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/) & [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (for future generative AI features)

## Getting Started

To run the app locally, clone the repository and follow these steps:

1.  **Install Dependencies:**
    Navigate to the project directory and install the necessary packages.
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables. You can use the `.env.example` file as a template.

3.  **Run the Development Server:**
    Start the development server.
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Environment Variables

To run this project, you will need to add the following environment variables to a `.env` file in the root of your project. You can use the `.env.example` file as a template.

-   `FIREBASE_PROJECT_ID`: Your Firebase project ID.
-   `FIREBASE_PRIVATE_KEY`: Your Firebase private key.
-   `FIREBASE_CLIENT_EMAIL`: Your Firebase client email.
-   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key.
-   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
-   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID.
-   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
-   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
-   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID.
-   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID.

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file in the root of the project contains the build settings. When you push to the main branch, Netlify will automatically build and deploy the site.

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## Content Management

Most text and links are stored in `src/data/content.json`. Video information is stored in `src/data/videos.json`. To add a new video, simply add its `youtubeUrl` to the `videos.json` file. The app will automatically fetch the title, description, and thumbnail.

The `content.json` file has the following structure:

```json
{
  "channelInfo": {
    "name": "NextGenXplorer",
    "goal": "...",
    "about": "..."
  },
  "socials": [
    {
      "name": "YouTube",
      "url": "https://youtube.com/@yourchannel",
      "handle": "@yourchannel"
    }
  ],
  "authors": [
    {
      "name": "Author Name",
      "url": "https://instagram.com/authorprofile",
      "handle": "@authorprofile"
    }
  ]
}
```

The `videos.json` file has the following structure:

```json
[
  {
    "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "relatedLinks": [
      {
        "label": "Link Label",
        "url": "https://example.com"
      }
    ]
  }
]
```

---
