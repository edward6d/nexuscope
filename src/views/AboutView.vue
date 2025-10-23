<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

</script>


<template>
  <h1 class="title">About</h1>
  <h4>What does NexuScope do?</h4>
  <p>NexuScope lets you interactively analyze and visualize Heroes of the Storm statistics. I built this tool for myself to learn Vue.js and help better inform my decisions during Storm League draft. If somebody else besides me is going to find it useful, that'd be great.</p>

  <h4>Why would I use this over HeroesProfile?</h4>
  <p>First of all, NexuScope is not intended as a replacement for HeroesProfile, but rather as a supplement. I'm not trying to reinvent the wheel here, it's an amazing tool and I use it all the time. If you're looking for latest hero or talent pick- and winrates, you can get them from there quickly, efficiently, and with great granularity. This is the kind of data that can get outdated really quickly, so you probably don't want to use a time scope beyond few last minor patches.</p>
  <p>But some characteristics are not very likely to change, even over multiple patches and could really benefit from larger sample sizes. As an example, buffs or nerfs to Xul might change where his overall winrate stands in comparison to other heroes, but they are unlikely to change the fact that Tomb of the Spider Queen is one of his best maps.</p>
  <p>Unfortunately, when I tried getting answers for these kind of questions using HeroesProfile, I found that queries over lots of patches can take a really long time, sometimes over a minute - which is a long time when you're trying to look up something on second monitor during Storm League draft. (it probably puts a great load on their servers)</p>
  <p>Additionally, I found that with HeroesProfile, it was easy to get answers to questions like "Which hero does have the highest winrate on map X?" or "Which map is hero X's best map?". However, I found that the question I was often asking myself was slightly different. It was "I like to play heroes X, Y and Z. I don't care about their absolute winrates, however I would like to draft them on their best maps. Which are these?". "Relative" performance view on the <RouterLink to="heroes">Heroes</RouterLink> page is an attempt to visualize the answer to this question.</p>

  <h4>What's the dataset used?</h4>
  <p>Currently I'm using stats for exclusively Storm League games from ranks Gold+ and hero levels 5+. These filters were selected to strike a balance between larger sample sizes and reducing noise from games in lower leagues and/or players inexperienced with their heroes. For now, these filters are baked in and static, but I might experiment with adding more datasets in the future (like dataset coming purely from competitive play).</p>

  <h4>I found a bug / I have an idea for a feature, where can I report these?</h4>
  <p>The best place would be <a href="https://github.com/edward6d/nexuscope/issues" target="_blank">the project's GitHub page</a>.</p>

  <h4>Disclaimer</h4>
  <p>This project uses aggregated data from <a href="https://www.heroesprofile.com/" target="_blank">HeroesProfile.com</a>. Without their work, this app couldn't exist. If you care about future of HotS match statistics, please support them.</p>
  <p>Heroes of the Storm and all related logos, artwork, and in-game assets are property of Blizzard Entertainment. This is a fan-made, non-commercial project and is not affiliated with, endorsed, or sponsored by Blizzard Entertainment. All trademarks are the property of their respective owners.</p>
</template>
