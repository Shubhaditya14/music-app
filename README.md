# Music App

This is a music streaming application with a visually rich frontend built using TypeScript, React, Next.js, Tailwind CSS, Framer Motion, and GSAP. The application features a sidebar for navigation, a catalogue of all songs, recently played tracks, top songs, and recommendations. It also includes a modern player bar with a full-screen mode that displays a "vinyl" effect for the album cover.

## Features

- **Responsive Sidebar Navigation**: A dynamic sidebar for easy navigation between Home, Catalogue, and Recents, with a mobile-friendly toggle.
- **Song Catalogue**: Browse all available songs.
- **Recently Played**: View your recently played tracks.
- **Top Songs & Recommendations**: Discover top songs and personalized recommendations.
- **Interactive Song Cards**: Song cards with subtle hover and tap animations using Framer Motion.
- **Modern Player Bar**: A sleek player bar at the bottom with play/pause controls and full-screen functionality.
- **Full-Screen Player with Vinyl Mode**:
  - Snappy open/close animation using Framer Motion.
  - Displays the album art with a rotating "vinyl" effect when music is playing.
- **"Apple Glass" UI**: Utilizes Tailwind CSS for glassmorphism effects (backdrops, blur, transparent layers, rounded corners).
- **Smooth Animations**: Leverages Framer Motion for UI component animations and GSAP for cinematic transitions (e.g., player bar entrance).

## Technologies Used

- **Frontend**:
  - [Next.js](https://nextjs.org/) (React Framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [React](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) (for UI animations)
  - [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) (for cinematic animations)
  - [Lucide React](https://lucide.dev/icons/) (for icons)
- **Backend**: (Assumed, based on API calls in `music-frontend/src/lib/api.ts`)
  - Python (likely with a framework like FastAPI or Flask)
  - `http://127.0.0.1:8000` is used as the `BASE_URL` for API calls.

## How to Run the Application

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A running backend server (as the frontend consumes data from `http://127.00.1:8000`)

### Steps

1.  **Clone the repository (if not already done):**
    ```bash
    git clone https://github.com/Shubhaditya14/music-app.git
    cd music-app
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd music-frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application should now be running at `http://localhost:3000` (or another available port if 3000 is in use).

5.  **Ensure Backend is Running**:
    Make sure your backend server is running and accessible at `http://127.0.0.1:8000` to provide song data. Without the backend, the frontend will not display any songs.