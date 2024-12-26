<script setup>
import { reactive, onMounted} from 'vue'
import {useToast} from 'vue-toast-notification';

import Loader from '@/components/Loader.vue';
import Post from '@/components/Post.vue';
import axios from 'axios'


let state = reactive({
    posts: [],

    isLoading: true
})

const toast = useToast();


onMounted(async () => {
    try {
      // await new Promise((resolve, reject) => setTimeout(resolve, 5000))

        let posts = await axios.get('http://127.0.0.1:8000/api/posts/dues/last-seven-days')
        console.log(posts);
        
        let {due_posts} = posts.data
        
        state.posts = due_posts
        state.isLoading = false
    } catch(error) {
        toast.error(error.message);

    }
    
    
})


</script>

<template>

<div v-if="state.isLoading">
    <Loader />
</div>
<div v-else  class="container mx-auto px-4 py-8">
  <div v-if="state.posts.length == 0">
    <h2>No Posts Found</h2>
  </div>
  <div v-else>
    <Post :posts="state.posts" :deletePost="deletePost" />

  </div>
</div>

</template>