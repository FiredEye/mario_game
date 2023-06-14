# Super Mario Game

Welcome to Mario Game! This is a classic platformer game inspired by Super Mario Bros. Your goal is to navigate through the platform, avoid obstacles, and reach the flag at the end.

## Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
- [Controls](#controls)
- [Gameplay](#gameplay)
- [API-DOCUMENTATION](#api-documentation)

## Installation

To play Super Mario Game on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/FiredEye/mario_game.git`
2. Navigate to the project directory: `cd mario_game/client`
3. Install the required dependencies: `npm install`
4. Navigate to the project directory: `cd mario_game/server`
5. Install the required dependencies: `npm install`

## Requirements

Note!! node and postgres must be installed in your system to run this program.

## Usage

Once you have installed the game,

1. At first navigate to the project directory: `cd mario_game/server`, direct to the `tableSetUp.js and index.js` file inside server folder then add your database name,username and password.
2. Then run command: `node tableSetUp.js`, also run command: `node index.js`
3. At last in new terminal navigate to the project directory: `cd mario_game/client` and run command: `npm run mario`

This will start the game and launch it in your default web browser. If it doesn't open automatically, you can access the game by visiting http://localhost:3000 in your browser.

## Controls

Add user name and click `Sart Game` to start the game
Use the up arrow key to make Mario jump.
Use the left and right arrow keys to move Mario left and right, respectively.
Press the spacebar to shoot a fireball.
Press the `P` key for pausing the game.

## Gameplay

Navigate through by moving Mario left or right.
Jump over obstacles such as Goombas to avoid getting hit.
Collect mushrooms to power up and gain special abilities.
Use the fireball to defeat enemies and earn points.
Be careful not to fall into pits or touch enemies without power-ups, as it will result in restart the game.
Reach the flag at the end to complete the game.

## API-DOCUMENTATION

For the Api Documentation you can visit http://localhost:5000/api/api-docs in your browser.
