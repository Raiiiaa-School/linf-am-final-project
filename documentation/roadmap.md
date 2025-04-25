# Project Roadmap: Elemental Chain Runner

This roadmap outlines the development phases for our fast-paced, side-scrolling action game inspired by Ghostrunner, featuring elemental chaining and action-based energy absorption, tailored for a 1.5-month school project.

## Phase 1: Core Engine & Movement (Estimated: 1 Week)

- **Goal:** Establish the foundational classes and basic character movement.
- **Tasks:**
    - **Project Setup:** Initialize project structure (HTML, CSS, JavaScript files).
    - **Canvas Initialization:** Set up the HTML canvas and basic rendering context.
    - **Input Handling:** Implement basic keyboard input detection for movement actions.
    - **Character Movement:** Implement core movement within a dedicated `Player` class: running, jumping, basic collision detection with level bounds.

## Phase 2: Elemental System Foundation (Estimated: 1 Week)

- **Goal:** Implement the basic elemental system and initial casting.
- **Tasks:**
    - **Elemental Data Structure:** Define a way to represent elements (e.g., objects with name, visual properties).
    - **Implement First Element:** Focus on one core element (e.g., Air) with basic visual effects (e.g., a simple projectile).
    - **Single Element Casting:** Implement the ability for the player to cast this element based on input.
    - **Basic Collision Detection (Projectiles):** Implement collision detection between the player's projectile and simple static obstacles.
    - **Basic Enemy Class:** Create a very basic `Enemy` class with position and simple movement.

## Phase 3: Chaining Prototype & Energy (Estimated: 1.5 Weeks)

- **Goal:** Implement a rudimentary chaining system and the action-based energy mechanic.
- **Tasks:**
    - **Introduce Second Element:** Add a second core element (e.g., Fire) with basic visuals.
    - **Basic Chaining Logic:** Implement a simple mechanism to chain the two elements (e.g., pressing a sequence of buttons). Define a very basic combined effect.
    - **Energy System:** Implement a basic energy variable for the player.
    - **Action-Based Energy Gain (Movement):** Implement energy gain based on player movement actions (e.g., jumping, dashing - if time allows for a basic dash).
    - **Simple Enemy Interaction:** Implement basic interaction between enemy and player (e.g., simple collision causing "damage" - no actual health yet).
    - **Simple Level Design (Test Chaining):** Create a small, linear level to test basic movement, casting, and chaining.

## Phase 4: Core Gameplay Loop & Enemy Interaction (Estimated: 2 Weeks)

- **Goal:** Establish a basic gameplay loop with enemy interaction and a level completion condition.
- **Tasks:**
    - **Refine Collision Detection:** Improve collision detection for player, enemies, and projectiles with the environment.
    - **Implement Basic Enemy "Damage":** Implement a simple way for enemies to take damage from elemental attacks.
    - **Implement Player "Health":** Introduce a basic health system for the player.
    - **Basic Game Over Condition:** Implement a simple game over state when player health reaches zero.
    - **Level Completion Condition:** Define a simple condition to complete a level (e.g., reaching the end).
    - **Basic UI:** Display player health and energy on the screen.
    - **Introduce Third Element (If Time Allows):** Add a third element with a basic chain interaction.

## Phase 5: Polish & Basic Level Design (Estimated: 1 Week)

- **Goal:** Improve the feel of the core mechanics and create a more complete level.
- **Tasks:**
    - **Refine Movement and Casting:** Improve the responsiveness and visual feedback of movement and elemental casting.
    - **Basic Visual Polish:** Add simple visual effects to attacks and interactions.
    - **Level Design - Challenge:** Create one more level with slightly more complex layouts and enemy placement to test the core mechanics.
    - **Sound Effects (Basic - If Time Allows):** Integrate a few basic sound effects for player actions and attacks.

## Contingency & Prioritization

- **Focus on Core Mechanics:** If time becomes a constraint, prioritize robust movement, a functional elemental system with chaining, and basic enemy interaction over visual polish or multiple levels.
- **Iterative Development:** Continuously test and iterate on the implemented features.
- **Clear Goals for Each Week:** Set achievable goals for each week to stay on track.

This roadmap focuses on building the fundamental engine and core gameplay loop within the given timeframe. More advanced features can be considered if time permits, but the priority is a functional and engaging core experience.
