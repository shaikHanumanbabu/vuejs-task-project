<script setup>
import {reactive, onMounted} from 'vue'
import {useToast} from 'vue-toast-notification';
import axios from 'axios'
import Loader from '@/components/Loader.vue';
import Post from '@/components/Post.vue';
import SinglePost from '@/components/SinglePost.vue';

let state = reactive({
    posts: [],
    isLoading: true
})

const toast = useToast();


const deletePost = async (postId) => {
    let confirm = window.confirm("Are you sure you want delete this post?")

    if(confirm) {
      let posts = state.posts.filter((post) => post.id != postId)
      state.posts = posts
      try {
        await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`)
        toast.success('Post deleted!!');
        
      } catch (error) {
        toast.error(error.message);
        
      }

    }
    
  }



onMounted(async () => {
    try {
      // await new Promise((resolve, reject) => setTimeout(resolve, 5000))

        let posts = await axios.get('http://127.0.0.1:8000/api/posts')
        let {data} = posts.data
        
        state.posts = data
        state.isLoading = false
    } catch(error) {
        
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