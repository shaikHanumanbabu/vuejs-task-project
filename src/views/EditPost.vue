<script setup>
import { useRoute } from 'vue-router';
import PostForm from '@/components/form/PostForm.vue';

const route = useRoute()

const postId = route.params.id

</script>

<template>
  <PostForm isEdit="true" :editId="postId" isLoading="true" />
</template>