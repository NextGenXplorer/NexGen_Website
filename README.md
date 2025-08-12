# NextGenXplorer

> Charting the course of tomorrow's technology, today.

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue)](https://www.npmjs.com/package/nextn) [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Netlify Status](https://api.netlify.com/api/v1/badges/ea28765b-ed2e-446e-9d83-898a1aaf5b90/deploy-status)](https://app.netlify.com/projects/nextgenxplorer/deploys) [![Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?logo=next.js)](https://nextjs.org) [![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

Welcome to the official repository for **NextGenXplorer**, a digital think tank and media hub dedicated to exploring the future of technology and its impact on our world.


## Our Mission

Our mission is to decode the future. We dissect and debate the technological forces—from artificial intelligence to quantum leaps—that are actively reshaping our world and defining the next chapter of human history. We produce visually striking, deeply researched content that demystifies the complex and provokes critical thought.

## Key Features

- **Dynamic Content:** Application content is managed through a combination of a centralized JSON file (`src/data/content.json`) for static text and social links, and a Firebase Firestore database for dynamic video content.
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
    Create a `.env` file in the root of the project and add the necessary environment variables. See the "Environment Variables" section below for details.

3.  **Run the Development Server:**
    Start the development server.
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Environment Variables

To run this project, you will need to add the following environment variables to a `.env` file. You can use the `.env.example` file as a template.

### Admin Authentication
-   `ADMIN_PASSWORD`: A secure password for accessing the admin panel.
-   `JWT_SECRET`: A long, random, and secret string used for signing authentication tokens. You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### Firebase (for Content)
The following variables are needed for the application to interact with Firebase services.

#### Client-Side (Public)
These are exposed to the browser and are safe to be public.
-   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key.
-   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
-   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID.
-   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
-   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
-   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID.
-   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID.

#### Server-Side (Admin & Content)
These are used on the server and must be kept secret. They grant admin access to your Firebase project, which is required for fetching video content from Firestore and for admin panel authentication.
-   `FIREBASE_PROJECT_ID`: Your Firebase project ID.
-   `FIREBASE_PRIVATE_KEY`: Your Firebase private key (the full key, including the header and footer).
-   `FIREBASE_CLIENT_EMAIL`: Your Firebase client email.

## Admin Authentication

The admin panel is protected by a password-based authentication system that is separate from Firebase Authentication. To log in, navigate to the `/login` page and enter the password defined in your `ADMIN_PASSWORD` environment variable.

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file in the root of the project contains the build settings. When you push to the main branch, Netlify will automatically build and deploy the site.

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## Content Management

This project uses a hybrid approach for content management:

### Static Content (`content.json`)
General site information, such as the channel name, mission statement, author details, and social media links, is managed in `src/data/content.json`. This file allows for easy updates to the site's core text and branding.

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

### Video Content (Firestore)
Video information is stored in a **Firebase Firestore** collection named `videos`. This allows for dynamic and scalable management of video content without requiring a code deployment for updates.

To add a new video, you must add a new document to the `videos` collection. Each document should have the following fields:

-   `youtubeUrl` (string): The full URL of the YouTube video (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`).
-   `relatedLinks` (array of maps): A list of related links, where each link has a `label` (string) and a `url` (string).
-   `createdAt` (timestamp): The timestamp of when the video was added. This is used for ordering.

The app will automatically fetch the video's title, description, and thumbnail from YouTube using the provided `youtubeUrl`.

### Site Statistics (Firestore)
The application tracks the total number of unique site visitors. This data is stored in a Firestore document at `stats/visits`. This document contains a single field:

-   `count` (number): The total number of visitors.

This count is automatically incremented once per user session and is displayed in the admin panel.

---
