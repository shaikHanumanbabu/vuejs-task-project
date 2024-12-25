<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';

let props = defineProps({
    post: Object, 
    deletePost: Function
})

const router = useRouter()

// Define computed properties to return style class based on priority
const getTaskStatusClass = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'; // High priority - red
        case 'medium':
          return 'bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300'; // Medium priority - yellow
        case 'low':
          return 'bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'; // Low priority - green
        default:
          return 'text-gray-500'; // Default color
      }
    };

  


</script>


<template>
<div class="max-w-full p-6 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg">
  <h2 class="text-2xl font-semibold text-gray-800">{{ post.title }} 

    
  </h2>

  <p class="text-gray-600">Priority: <span :class="getTaskStatusClass(post.priority)">{{ post.priority.toUpperCase() }}</span></p>
  <p class="text-gray-600">Due Date: <span>{{ post.due_date }}</span></p>
  

  <!-- <p class="text-gray-600 mt-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras scelerisque ligula vitae quam maximus, in sagittis felis facilisis.
  </p> -->
  <!-- <a href="#" class="mt-6 ml-3 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View</a> -->
  <RouterLink :to="`/posts/edit/${post.id}`" class="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded hover/:bg-blue-600">Edit</RouterLink>
  <button type="button" @click="deletePost(post.id)" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
  </div>
</template>