---
layout: base
title: SP GAME
permalink: /SPGame/S$P RPG
---

<div id="gameContainer">
<canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import GameControl from '/SPgame/assets/js/csseRPG/SPgame/GameControl.js';
    
    const path = "{{site.baseurl}}";
    
    // Start game engine
    GameControl.start(path);
</script>