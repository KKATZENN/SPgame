---
layout: base
title: SP GAME
permalink: /navigation/spGame
---

<link rel="stylesheet" href="{{site.baseurl}}/assets/css/styles.css">

<style>
#gameContainer {
    position: relative;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: hidden;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

canvas {
    position: absolute;
    image-rendering: pixelated;
    background-color: transparent;
    margin: 0;
    padding: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#errorMessage {
    color: red;
    padding: 20px;
    font-family: monospace;
    white-space: pre-wrap;
    z-index: 1000;
    position: relative;
}

#stats-container {
    position: fixed;
    top: 75px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
}
</style>

<div id="gameContainer">
    <canvas id="gameCanvas"></canvas>
    <div id="errorMessage"></div>
</div>

<script type="module">
    // Function to display detailed error messages
    function showError(message, error) {
        const errorDiv = document.getElementById('errorMessage');
        const detailedMessage = `Error: ${message}\n\nDetails: ${error.message}\n\nStack: ${error.stack}`;
        console.error(detailedMessage);
        errorDiv.textContent = detailedMessage;
    }

    // Function to check if a module exists
    async function checkModule(path) {
        try {
            console.log('Attempting to load module:', path);
            const module = await import(path);
            console.log(`Successfully loaded module: ${path}`);
            return module;
        } catch (error) {
            console.error(`Failed to load module: ${path}`, error);
            throw new Error(`Failed to load module: ${path} - ${error.message}`);
        }
    }

    // Main initialization
    async function initGame() {
        try {
            console.log('Starting game initialization...');
            
            // Get the base URL from Jekyll and construct the full origin
            const baseUrl = '{{site.baseurl}}';
            const fullOrigin = `${window.location.origin}${baseUrl}`;
            console.log('Full origin path:', fullOrigin);
            
            // Construct the absolute paths using the full origin
            const gameEnvPath = `${fullOrigin}/assets/js/csseRPG/spgame/GameEnv.js`;
            const gameControlPath = `${fullOrigin}/assets/js/csseRPG/spgame/GameControl.js`;
            
            console.log('Loading GameEnv from:', gameEnvPath);
            const GameEnvModule = await checkModule(gameEnvPath);
            window.GameEnv = GameEnvModule.default;
            console.log('GameEnv loaded successfully:', GameEnvModule);

            console.log('Loading GameControl from:', gameControlPath);
            const GameControlModule = await checkModule(gameControlPath);
            console.log('GameControl loaded successfully:', GameControlModule);
            
            console.log('Setting up canvas...');
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas element not found in the DOM');
            }
            
            console.log('Starting game with GameControl...');
            GameControlModule.default.start(fullOrigin);
            console.log('Game initialization completed');
            
        } catch (error) {
            showError('Failed to initialize game', error);
        }
    }

    // Wait for DOM to be ready and then initialize
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Content Loaded, initializing game...');
        initGame().catch(error => {
            showError('Failed to initialize game after DOM load', error);
        });
    });
</script>