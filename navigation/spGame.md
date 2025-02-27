---
layout: base
title: SP GAME
permalink: /csseRPG/SPGame
---

<div id="gameContainer">
<canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import GameControl from '{{site.baseurl}}/assets/js/csseRPG/SPgame/GameControl.js';
    
    const path = "{{site.baseurl}}";
    
    // Start game engine
    GameControl.start(path);
</script>