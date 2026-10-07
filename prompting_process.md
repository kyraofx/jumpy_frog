# Jumpy Frog — Prompting Process

## Project Overview

Jumpy Frog is a small Canvas API browser game created through a single focused prompt. This document records the Version 1 request, the resulting files, and the implementation choices made for a beginner-friendly codebase.

**Model used:** Model information was not available in the session metadata.  
**Last updated:** October 7, 2026

## Version 1 — Simple Playable Game

**Created:** October 7, 2026

### Prompt 1 — Build Jumpy Frog

**Date:** October 7, 2026

**User prompt:**

> Before doing anything, read and follow these skills from my Desktop skill folder:
>
> - `explain-code-with-comments`
> - `readme-skill`
> - `document-prompting`
>
> Then build a simple browser game called **Jumpy Frog** using only: (Create a folder in desktop/ai\_projs called jumpy\_frog)
>
> - `index.html`
> - `style.css`
> - `script.js`
>
> Use plain HTML, CSS, and JavaScript with an HTML `<canvas>`.
>
> Game concept:
>
> - The player controls a small frog underwater.
> - The frog naturally sinks downward.
> - Pressing Space, clicking, or tapping makes the frog jump/swim upward.
> - Kelp obstacles move from right to left.
> - Kelp should come from both the top and bottom with a gap between them.
> - Randomize the vertical position of the gap.
> - Increase the score by 1 whenever the frog successfully passes an obstacle.
> - End the game if the frog touches kelp, the ocean floor, or the top boundary.
> - Include a simple start state, playing state, game-over screen, final score, and restart option.
>
> Visual style:
>
> - Cute underwater theme
> - Blue/turquoise water
> - Green kelp
> - Sandy or rocky ocean floor
> - Simple bright green frog
> - A few subtle bubbles
> - Clean and polished, but keep Version 1 simple
>
> Draw the frog, kelp, background, and bubbles directly with the Canvas API. Do not use external image assets yet.
>
> Keep the JavaScript beginner-friendly.
>
> Avoid unnecessary:
>
> - frameworks
> - classes
> - modules
> - complicated abstractions
> - clever compressed code
>
> Use clear functions for responsibilities such as:
>
> - frog movement
> - jumping
> - creating kelp
> - moving kelp
> - collision detection
> - scoring
> - drawing
> - restarting
> - the game loop
>
> Follow the `explain-code-with-comments` skill carefully.
>
> Add educational comments above meaningful chunks of code explaining what each section does and why it exists.
>
> Do not comment every line.
>
> Also create a clear `README.md` using the `readme-skill`. The README should explain:
>
> - what Jumpy Frog is
> - how to run it
> - the three main files
> - the controls
> - the basic game architecture
> - important concepts used in the project
>
> Use the `document-prompting` skill to keep all explanations clear, structured, concise, and easy for a beginner to understand.
>
> Build the simplest working Version 1 first. Do not add advanced features yet.

**Prompt summary:** Read and follow the three Desktop skills, then create `Desktop/ai_projs/jumpy_frog` as a simple underwater Canvas API game using plain HTML, CSS, and JavaScript. Include beginner-friendly comments, documentation, all requested game states and controls, randomized kelp, scoring, collisions, and Canvas-drawn visuals without advanced features.

**Generated:**

- `index.html` with a canvas, page heading, accessible label, and control hint
- `style.css` with a responsive underwater presentation and visible keyboard focus
- `script.js` with movement, jumping, kelp creation and recycling, collisions, scoring, drawing, restart behavior, and the animation loop
- `README.md` with features, controls, file roles, architecture, concepts, and local run instructions
- `prompting_process.md` with this Version 1 development record

**Decisions and validation:**

- Used only browser-native HTML, CSS, JavaScript, and Canvas APIs
- Kept game data in simple variables, arrays, and plain objects instead of classes or modules
- Used named functions for each major responsibility so beginners can follow the game loop
- Added educational comments above meaningful chunks and JSDoc comments above functions without narrating every line
- Treated the frog as a circle-sized bounding box for collision detection to keep the math approachable
- Recycled off-screen kelp so the obstacle list stays small during long play sessions
- Passed `node --check` and a browser smoke test covering start, play, moving kelp, collision, game over, and restart, with no console errors
- Deferred sound, saved high scores, difficulty levels, and image assets to keep this milestone focused

### Version 1 Result

Version 1 provides a complete, playable game with all requested states, controls, collision rules, scoring, randomized kelp gaps, and Canvas-drawn underwater visuals. The source is intentionally direct and extensively organized for a beginner to read.

## Current Status

Jumpy Frog is at its first playable milestone. Advanced features remain intentionally deferred until a later version is requested.
