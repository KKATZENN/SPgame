---
layout: base
title: SP GAME
permalink: /SPGame/spGame.md
---


<canvas id='gameCanvas'></canvas>

<script type="module">
    import GameControl from '/SPgame/assets/js/csseRPG/SPgame/GameControl.js';

    // Background data
    const image_src = "/Spgame/images/rpg/spritesheet (grass)";
    const image_data = {
        pixels: {height: 580, width: 1038}
    };
    const image = {src: image_src, data: image_data};

    // Sprite data
    const sprite_src = "/Spgame/images/rpg/spritesheet.rpg";
    const sprite_data = {
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        pixels: {height: 280, width: 256},
        orientation: {rows: 4, columns: 3 },
        down: {row: 2, start: 0, columns: 5 },
        left: {row: 3, start: 0, columns: 5 },
        right: {row: 4, start: 0, columns: 5 },
        up: {row: 5, start: 0, columns: 5 },
    };
    const sprite = {src: sprite_src, data: sprite_data};

    //assets that are being used
    const assets = {image: image, sprite: sprite}

    // Start game engine
    GameControl.start(assets);
</script>