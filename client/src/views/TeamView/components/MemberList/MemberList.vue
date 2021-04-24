<template>
  <ol class="member-list">
    <p class="member-list__header">Members</p>
    <MemberItem
      class="member-list__member"
      v-for="member in sortedMembers"
      :key="member.id"
      :member="member"
      :profile="profile"
      :teamInfo="teamInfo"
      @open-menu="openMenu"
    >
    </MemberItem>
    <vue-context ref="menu" v-slot="{ data }">
      <li>
        <a
          v-if="data && isManager && data.member.id !== teamInfo.manager"
          @click.prevent="transferManager(data.member.id)"
        >
          Transfer leadership
        </a>
      </li>
      <li>
        <a v-if="data && isManager && data.member.id !== profile.id" @click.prevent="kickMember(data.member.id)">
          Kick member
        </a>
      </li>
      <li>
        <a v-if="data && data.member.id === profile.id" @click.prevent="leaveTeam"> Leave team </a>
      </li>
    </vue-context>
  </ol>
</template>

<script lang="ts" src="./MemberList.ts"></script>
<style lang="scss" src="./MemberList.scss"></style>
