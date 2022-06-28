<template>
  <div class="team-view">
    <div class="team-view__content">
      <MemberList
        class="team-view__member-list"
        @transfer-manager="requestTransferManager"
        @kick-member="requestKickMember"
        @update-color="updatePlayerColor"
      />
      <TeamInfo
        :teamInfo="teamInfo"
        :serverString="serverString"
        :isManager="isManager"
        @show-edit="toggleEditForm"
        @leave-team="requestTeamLeave"
        @delete-team="requestTeamDelete"
      />
      <transition name="fade">
        <EditTeamForm v-if="showEditForm" :teamInfo="teamInfo" @cancel="toggleEditForm" @submit="requestTeamUpdate" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
