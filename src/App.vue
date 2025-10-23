<script setup lang="ts">
import { RouterView } from 'vue-router'
import { BIcon, BNavbar, BNavbarItem } from 'buefy'
import 'inter-ui/inter-latin.css' // some native fallback sans-serif fonts can look awful
</script>

<template>
  <section class="section">
    <div class="container">
      <header>
        <BNavbar>
          <template #brand>
            <BNavbarItem tag="router-link" to="/">
              <img src="@/assets/img/site_icon.svg" alt="NexuScope logo" title="NexuScope"/>
            </BNavbarItem>
          </template>
          <template #start>
            <BNavbarItem tag="router-link" to="/heroes">
              <span class="icon-text">
                <BIcon icon="account-group" />
                <span>Heroes</span>
              </span>
            </BNavbarItem>
            <BNavbarItem tag="router-link" to="/maps">
              <span class="icon-text">
                <BIcon icon="map" />
                <span>Maps</span>
              </span>
            </BNavbarItem>
          </template>
          <template #end>
            <BNavbarItem tag="router-link" to="/settings">
              <span class="icon-text">
                <BIcon icon="cog" />
                <span>Settings</span>
              </span>
            </BNavbarItem>
            <BNavbarItem tag="router-link" to="/about">
              <span class="icon-text">
                  <BIcon icon="information" />
                  <span>About</span>
                </span>
            </BNavbarItem>
          </template>
        </BNavbar>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </section>
</template>

<style scoped>
.navbar-brand>.navbar-item>img {
  width:48px;
}
.navbar-brand>.navbar-item {
  padding-top: 0 ;
  padding-bottom: 0 ;
}
.navbar-item.router-link-exact-active:not(.navbar-brand .navbar-item)
{
  /* we highlight selected navbar item permanently */
  --bulma-navbar-item-background-l-delta: var(--bulma-navbar-item-active-background-l-delta); --bulma-navbar-item-background-a: 1;
}
</style>
