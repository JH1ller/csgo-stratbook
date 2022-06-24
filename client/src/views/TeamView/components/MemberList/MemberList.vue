<template>
  <ol class="member-list">
    <MemberItem
      v-for="member in sortedMembers"
      class="member-list__member"
      :key="member._id"
      :member="member"
      :profile="profile"
      :teamInfo="teamInfo"
      @update-color="updateColor"
      @transfer-manager="transferManager"
      @kick-member="kickMember"
    >
    </MemberItem>
  </ol>
</template>

<script lang="ts" src="./MemberList.ts"></script>
<style lang="scss" src="./MemberList.scss"></style>
