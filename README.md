# Jumpy Frog

Jumpy Frog is a beginner-friendly browser game in which a bright green frog swims through moving underwater kelp. It uses a single HTML canvas and has no dependencies, image assets, or build step.

## Features

- Simple start, playing, and game-over states
- Space, mouse, and touch controls
- Randomized gaps between top and bottom kelp
- Score tracking for every obstacle passed
- Canvas-drawn frog, kelp, bubbles, water, and ocean floor
- Responsive layout for desktop and mobile screens

## Keyboard Controls

| Control | Action |
| --- | --- |
| `Space` | Start, swim upward, or restart |
| Click or tap | Start, swim upward, or restart |

## Built With

- HTML
- CSS
- Vanilla JavaScript
- Canvas API

## Project Structure

```text
jumpy_frog/
├── index.html
├── style.css
├── script.js
├── README.md
└── prompting_process.md
```

## Basic Architecture

- `index.html` provides the page structure and the canvas where the game appears
- `style.css` centers the game, adds the page theme, and makes the canvas responsive
- `script.js` stores game state, updates movement and collisions, draws each frame, and handles controls

The game loop runs once per animation frame. While the game is active, it updates the frog, obstacles, score, and collisions before drawing the new scene. The `gameState` value decides whether the canvas shows the start screen, active game, or game-over screen.

## Important Concepts

- **Canvas drawing:** Shapes, colors, text, and gradients create every visual directly in JavaScript
- **Animation loop:** `requestAnimationFrame()` repeatedly updates and redraws the game
- **Game state:** A string tracks whether the player is at the start, playing, or finished
- **Physics:** Gravity increases downward speed, while a jump gives the frog upward speed
- **Collision detection:** The frog's bounds are compared with kelp and screen boundaries
- **Object recycling:** Kelp that leaves the screen is moved back into the obstacle sequence
- **Event handling:** Keyboard and pointer events call the same control function

## Run Locally

No build step or package installation is required.

1. Open the project folder:

   ```bash
   cd ~/Desktop/ai_projs/jumpy_frog
   ```

2. Open `index.html` in a modern browser. On macOS, you can run:

   ```bash
   open index.html
   ```

You can also double-click `index.html` in Finder.
