<div align="center">

# 🚀 NextGenXplorer

### *Charting the course of tomorrow's technology, today.*

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue)](https://www.npmjs.com/package/nextn)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ea28765b-ed2e-446e-9d83-898a1aaf5b90/deploy-status)](https://app.netlify.com/projects/nextgenxplorer/deploys)
[![Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange?logo=firebase)](https://firebase.google.com/)

**A modern, full-featured digital think tank and media hub exploring the future of technology**

[Live Demo](https://nextgenxplorer.netlify.app) • [Report Bug](https://github.com/mithun50/NexGen_Website/issues) • [Request Feature](https://github.com/mithun50/NexGen_Website/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Content Management](#-content-management)
- [Admin Panel](#-admin-panel)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**NextGenXplorer** is a cutting-edge digital platform that decodes the future of technology. We dissect and debate technological forces—from artificial intelligence to quantum computing—that are actively reshaping our world and defining the next chapter of human history.

### Our Mission

To produce visually striking, deeply researched content that demystifies complex technology and provokes critical thought about our digital future.

---

## ✨ Features

### 🎬 **Video Content Management**
- Dynamic video archives powered by Firebase Firestore
- Automatic YouTube metadata fetching (titles, thumbnails, descriptions)
- Public/Private video visibility controls
- Related links for each video
- Responsive video grid layout

### 📱 **Apps Distribution**
- Dedicated apps page for software distribution
- Support for external hosting (MediaFire, Google Drive, GitHub)
- Logo and download URL management
- Full CRUD operations via admin panel

### 👤 **Visitor Analytics**
- Real-time visitor tracking
- Session-based counting (prevents duplicates)
- Admin dashboard with statistics
- Firebase-powered analytics storage

### 🔐 **Secure Admin Panel**
- JWT-based authentication
- Protected API routes
- Video management (add, edit, delete, visibility toggle)
- App management (add, edit, delete)
- Visitor statistics dashboard

### 🎨 **Modern UI/UX**
- Dark/Light theme support
- Fully responsive design (mobile-first)
- Smooth animations and transitions
- Accessible components (ARIA compliant)
- ShadCN UI component library

### 🔗 **Social Integration**
- Dynamic social media links
- Author profiles
- Contact form integration
- Multiple platform support

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ShadCN UI](https://ui.shadcn.com/) - Component Library
- [Lucide Icons](https://lucide.dev/) - Icon System

</td>
<td>

**Backend & Database**
- [Firebase Firestore](https://firebase.google.com/docs/firestore) - Database
- [Firebase Storage](https://firebase.google.com/docs/storage) - File Storage
- [Firebase Auth](https://firebase.google.com/docs/auth) - Authentication
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Backend API

</td>
</tr>
<tr>
<td>

**Development Tools**
- [ESLint](https://eslint.org/) - Code Linting
- [TypeScript](https://www.typescriptlang.org/) - Type Checking
- [Prettier](https://prettier.io/) - Code Formatting

</td>
<td>

**Deployment & Hosting**
- [Netlify](https://www.netlify.com/) - Hosting Platform
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [Vercel](https://vercel.com/) - Alternative Hosting

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mithun50/NexGen_Website.git
   cd NexGen_Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Firebase credentials (see [Environment Setup](#-environment-setup))

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

### 🔑 Admin Authentication

```env
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key_here
```

> **Generate JWT Secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 🔥 Firebase Configuration

#### Client-Side (Public - Safe to expose)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Server-Side (Private - Keep secure)

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
```

> **Alternative:** Use service account JSON
> ```env
> FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"..."}'
> ```

---

## 📁 Project Structure

```
NexGen_Website/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (pages)/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/            # About page
│   │   │   ├── apps/             # Apps distribution page
│   │   │   ├── contact/          # Contact page
│   │   │   ├── socials/          # Social links page
│   │   │   ├── youtube/          # Video archives
│   │   │   └── admin/            # Admin panel
│   │   ├── api/                  # API Routes
│   │   │   ├── apps/             # Apps CRUD operations
│   │   │   ├── videos/           # Video management
│   │   │   ├── stats/            # Visitor analytics
│   │   │   └── auth/             # Authentication
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # ShadCN UI components
│   │   ├── layout/               # Layout components
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   ├── auth/                 # Auth components
│   │   └── visitor-tracker.tsx   # Analytics
│   ├── lib/                      # Utility libraries
│   │   ├── firebase.ts           # Firebase client
│   │   ├── firebase-admin.ts     # Firebase admin
│   │   ├── auth.ts               # Auth utilities
│   │   └── utils.ts              # Helper functions
│   ├── hooks/                    # Custom React hooks
│   └── data/                     # Static data
│       └── content.json          # Site content
├── public/                       # Static assets
├── .env                          # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 📝 Content Management

### Static Content (`content.json`)

Manage site-wide content like channel info, social links, and author details:

```json
{
  "channelInfo": {
    "name": "NextGenXplorer",
    "goal": "Exploring the future of technology",
    "about": "A digital think tank dedicated to..."
  },
  "socials": [
    {
      "name": "YouTube",
      "url": "https://youtube.com/@nextgenxplorer",
      "handle": "@nextgenxplorer"
    }
  ],
  "authors": [
    {
      "name": "Your Name",
      "url": "https://instagram.com/yourhandle",
      "handle": "@yourhandle"
    }
  ]
}
```

### Dynamic Content (Firestore)

#### Videos Collection

Videos are stored in Firebase Firestore under the `videos` collection:

**Document Structure:**
```typescript
{
  id: string;                    // Auto-generated
  youtubeUrl: string;            // Full YouTube URL
  youtubeId: string;             // Extracted video ID
  title: string;                 // Fetched from YouTube
  description: string;           // Fetched from YouTube
  thumbnailUrl: string;          // Max resolution thumbnail
  relatedLinks: Array<{
    label: string;
    url: string;
  }>;
  isPublic: boolean;             // Visibility flag
  createdAt: Timestamp;          // Creation date
}
```

#### Apps Collection

Apps are stored in the `apps` collection:

**Document Structure:**
```typescript
{
  id: string;                    // Auto-generated
  name: string;                  // App name
  description: string;           // App description
  logoUrl: string;               // Logo image URL
  downloadUrl: string;           // Download link
  createdAt: Timestamp;          // Creation date
  updatedAt?: Timestamp;         // Last update
}
```

#### Stats Collection

Visitor statistics are stored in `stats/visits`:

```typescript
{
  count: number;                 // Total visitor count
}
```

---

## 🔐 Admin Panel

Access the admin panel at `/admin` after logging in at `/login`.

### Features

#### 📊 **Dashboard**
- Real-time visitor statistics
- Quick overview of content

#### 🎬 **Video Management**
- **Add Videos:** Paste YouTube URL, add related links, set visibility
- **Edit Videos:** Modify related links and visibility
- **Delete Videos:** Remove videos from archive
- **Auto-fetch:** Automatically retrieves video metadata

#### 📱 **App Management**
- **Add Apps:** Name, description, logo URL, download URL
- **Edit Apps:** Update app information and links
- **Delete Apps:** Remove apps from distribution

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Login Page
    participant API
    participant Firebase

    User->>Login Page: Enter password
    Login Page->>API: POST /api/auth/login
    API->>API: Verify password
    API->>User: Set JWT cookie
    User->>Admin Panel: Access /admin
    Admin Panel->>API: Request with cookie
    API->>API: Verify JWT
    API->>Firebase: Fetch data
    Firebase-->>API: Return data
    API-->>Admin Panel: Display data
```

---

## 🔌 API Reference

### Videos API

#### `GET /api/videos`
Fetch videos (public or all for admin)

**Response:**
```json
[
  {
    "id": "video123",
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "title": "Video Title",
    "thumbnailUrl": "https://...",
    "relatedLinks": [],
    "isPublic": true
  }
]
```

#### `POST /api/videos`
Add new video (admin only)

**Request:**
```json
{
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "relatedLinks": [{"label": "Link", "url": "https://..."}],
  "isPublic": true
}
```

#### `DELETE /api/videos`
Delete video (admin only)

**Request:**
```json
{
  "id": "video123"
}
```

### Apps API

#### `GET /api/apps`
Fetch all apps (public)

#### `POST /api/apps`
Add new app (admin only)

**Request:**
```json
{
  "name": "My App",
  "description": "App description",
  "logoUrl": "https://...",
  "downloadUrl": "https://..."
}
```

#### `PUT /api/apps`
Update app (admin only)

**Request:**
```json
{
  "id": "app123",
  "name": "Updated Name",
  "description": "Updated description",
  "logoUrl": "https://...",
  "downloadUrl": "https://..."
}
```

#### `DELETE /api/apps`
Delete app (admin only)

### Stats API

#### `GET /api/stats`
Get visitor count (admin only)

#### `POST /api/stats`
Increment visitor count (public)

---

## 🚢 Deployment

### Netlify (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Netlify

2. **Configure Build Settings**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```

3. **Set Environment Variables**
   - Add all `.env` variables in Netlify dashboard

4. **Deploy**
   - Push to `main` branch triggers automatic deployment

### Vercel Alternative

```bash
npm install -g vercel
vercel --prod
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

---

## 📊 Architecture Diagrams

### Visitor Tracking Flow

```mermaid
sequenceDiagram
    participant Browser
    participant VisitorTracker
    participant API
    participant Firestore

    Browser->>VisitorTracker: Load page
    VisitorTracker->>VisitorTracker: Check session storage
    alt Not counted
        VisitorTracker->>API: POST /api/stats
        API->>Firestore: Increment count
        Firestore-->>API: Success
        API-->>VisitorTracker: { success: true }
        VisitorTracker->>VisitorTracker: Mark as counted
    else Already counted
        VisitorTracker->>VisitorTracker: Skip tracking
    end
```

### Admin Authentication Flow

```mermaid
sequenceDiagram
    participant Admin
    participant AdminPage
    participant API
    participant verifyAdmin
    participant Firestore

    Admin->>AdminPage: Access /admin
    AdminPage->>API: GET /api/stats
    API->>verifyAdmin: Verify JWT cookie
    alt Authorized
        API->>Firestore: Read stats
        Firestore-->>API: Return data
        API-->>AdminPage: Display data
    else Unauthorized
        API-->>AdminPage: 401 Error
        AdminPage->>AdminPage: Redirect to login
    end
```

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Firebase](https://firebase.google.com/) - Backend infrastructure
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## 📞 Support

- 🐛 [Report Issues](https://github.com/mithun50/NexGen_Website/issues)
- 💬 [Discussions](https://github.com/mithun50/NexGen_Website/discussions)
- 📧 Contact: [Your Email]

---

<div align="center">

**Made with ❤️ by NextGenXplorer Team**

⭐ Star us on GitHub if you find this project useful!

</div>
