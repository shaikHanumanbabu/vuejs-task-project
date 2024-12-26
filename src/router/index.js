import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import AddTask from '@/views/AddTask.vue';
import EditPost from '@/views/EditPost.vue';
import DueTask from '@/views/DueTask.vue';
const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/posts/add-post', name: 'add-post', component: AddTask },
    { path: '/posts/edit/:id', name: 'edit-task', component: EditPost },
    { path: '/posts/upcomming-posts', name: 'upcomming-task', component: DueTask },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;