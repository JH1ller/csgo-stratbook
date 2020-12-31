<template>
  <div class="team-view">
    <div class="team-view__content">
      <TeamInfo 
        :teamInfo="teamInfo" 
        :serverString="serverString"
        :isManager="isManager"
        @show-edit="toggleEditForm"
        @delete-team="requestTeamDelete"
      />
      <div class="team-view__right-wrapper">
        <img :src="teamAvatarUrl" alt class="team-view__avatar" />
        <MemberList
          class="team-view__member-list"
          @leave-team="requestTeamLeave"
          @transfer-manager="requestTransferManager"
          @kick-member="requestKickMember"
        />
      </div>
    </div>
    <transition name="fade">
      <EditTeamForm 
        v-if="showEditForm" 
        :teamInfo="teamInfo" 
        @cancel="toggleEditForm" 
        @submit="requestTeamUpdate"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
