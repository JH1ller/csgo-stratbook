<template>
    <div class="team-view">
      <team-info />
      <div class="team-view__right-wrapper">
        <img :src="teamAvatarUrl" alt class="team-view__avatar" />
        <member-list 
          class="team-view__member-list" 
          @leave-team="requestTeamLeave" 
        />
      </div>
    </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
