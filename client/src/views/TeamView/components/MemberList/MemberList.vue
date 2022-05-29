<template>
  <ol class="member-list">
    <MemberItem
      class="member-list__member"
      v-for="member in sortedMembers"
      :key="member._id"
      :member="member"
      :profile="profile"
      :teamInfo="teamInfo"
      @open-menu="openMenu"
    >
    </MemberItem>
    <vue-context ref="menu" v-slot="{ data }">
      <li>
        <a
          v-if="data && isManager && data.member._id !== teamInfo.manager"
          @click.prevent="transferManager(data.member._id)"
        >
          Transfer leadership
        </a>
      </li>
      <li>
        <a v-if="data && isManager && data.member._id !== profile._id" @click.prevent="kickMember(data.member._id)">
          Kick member
        </a>
      </li>
      <li>
        <a v-if="data && data.member._id === profile._id" @click.prevent="leaveTeam"> Leave team </a>
      </li>
    </vue-context>
  </ol>
</template>

<script lang="ts" src="./MemberList.ts"></script>
<style lang="scss" src="./MemberList.scss"></style>
