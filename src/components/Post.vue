<script setup>
import SinglePost from './SinglePost.vue';

let {posts} = defineProps({
    posts: [],
    deletePost: Function
})







</script>

<template>

<div v-for="post in posts" :key="post.id">
  <SinglePost :post="post" :deletePost="deletePost"/>
</div>

</template>