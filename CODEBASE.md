# Codebase Overview

This document provides a comprehensive overview of the "Quantum Donkey" project, a lightweight, minimal React application featuring an interactive particle simulation (Boids).

## Project Structure

The project is built using **Vite**, **React**, and **TypeScript**.

```text
/
├── public/              # Static assets (favicons, etc.)
├── src/                 # Source code
│   ├── assets/          # Component assets
│   ├── components/      # React components
│   │   └── BoidsBackground.tsx  # Core Boids simulation logic and canvas component
│   ├── App.css          # Styling for the main App component
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles and resets
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # TypeScript definitions for Vite
├── .github/             # GitHub configuration
│   └── workflows/       # GitHub Actions workflows
│       └── deploy.yml   # Deployment workflow for GitHub Pages
├── index.html           # Main HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Key Files & Functionality

### 1. `src/components/BoidsBackground.tsx`
This is the heart of the visual experience. It implements a custom "Boids" flocking simulation using the HTML5 Canvas API.

*   **`class Boid`**: Represents a single particle.
    *   **Properties**: `position`, `velocity`, `acceleration`.
    *   **Behaviors (Methods)**:
        *   `flock(boids, mouse, isMouseDown)`: Calculates all forces acting on the boid.
        *   `align()`: Steer towards the average heading of local flockmates.
        *   `cohesion()`: Steer to move toward the average position of local flockmates.
        *   `separation()`: Steer to avoid crowding local flockmates.
        *   `seek(target, attract)`: Handles interaction with the mouse cursor.
            *   **Default Behavior**: Flees (repels) from the mouse cursor.
            *   **On Click (Hold)**: Seeks (attracts) towards the mouse cursor.
        *   `update()`: Updates position based on velocity and acceleration.
        *   `edges()`: Implements wrapping behavior (boids reappear on the opposite side of the screen).
        *   `draw()`: Renders the boid as a triangle pointing in its direction of travel.

*   **`BoidsBackground` Component**:
    *   Sets up the full-screen `<canvas>` element.
    *   Manages the animation loop using `requestAnimationFrame`.
    *   Handles window resize events to ensure the canvas always fills the screen.
    *   Tracks mouse position and click state to pass to the simulation.

### 2. `src/App.tsx`
The main React component that structures the page.

*   Renders `<BoidsBackground />` as a background layer (z-index 0).
*   Renders the content container (z-index 1) which holds the title and description.
*   Uses CSS to ensure the content floats above the canvas while allowing mouse events to pass through to the canvas where appropriate.

### 3. `src/main.tsx`
The entry point that mounts the React application into the DOM.

### 4. `src/index.css` & `src/App.css`
*   **`index.css`**: Resets margins/padding, sets the font family, and ensures the body takes up the full viewport height (`100vh`) with `overflow: hidden` to prevent scrollbars.
*   **`App.css`**: Styles the content overlay, centering text and managing z-indices to layer content correctly over the background.

## Scripts & Tooling

*   **`npm run dev`**: Starts the Vite development server.
*   **`npm run build`**: Compiles TypeScript and builds the production-ready assets in `dist/`.
*   **`npm run preview`**: Locally previews the production build.

## Deployment

The project is configured for automated deployment to **GitHub Pages** via GitHub Actions.

*   **Workflow File**: `.github/workflows/deploy.yml`
*   **Trigger**: Pushes to the `main` branch.
*   **Process**:
    1.  Checks out code.
    2.  Installs dependencies (`npm ci`).
    3.  Builds the project (`npm run build`).
    4.  Uploads the `dist` folder artifact.
    5.  Deploys the artifact to the `github-pages` environment.
