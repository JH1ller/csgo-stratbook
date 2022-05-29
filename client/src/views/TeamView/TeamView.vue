<template>
  <div class="team-view">
    <MemberList
      class="team-view__member-list"
      @leave-team="requestTeamLeave"
      @transfer-manager="requestTransferManager"
      @kick-member="requestKickMember"
    />
    <TeamInfo
      :teamInfo="teamInfo"
      :serverString="serverString"
      :isManager="isManager"
      @show-edit="toggleEditForm"
      @delete-team="requestTeamDelete"
    />
    <transition name="fade">
      <EditTeamForm v-if="showEditForm" :teamInfo="teamInfo" @cancel="toggleEditForm" @submit="requestTeamUpdate" />
    </transition>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
