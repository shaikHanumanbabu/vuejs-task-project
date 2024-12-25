<script setup>
import { reactive, onMounted , ref} from 'vue'
import {useToast} from 'vue-toast-notification';

import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css'; // Import the styles
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'vue-router';


const state = reactive({
  title: "",
  priority: "high",
  due_date: ""

})


const toast = useToast();

const router = useRouter()


const isLoading = ref(false)

// Error messages
const errors = reactive({});

// Zod schema
const formSchema = z.object({
  title: z.string().nonempty("Title is required").max(255, "Title cannot exceed 255 characters"),
  priority: z.enum(["low", "medium", "high"], "Priority is required"),
  due_date: z.string().refine(
    (date) => new Date(date) >= new Date(),
    "Due Date cannot be in the past"
  ),
});

// Validation logic using Zod
const validateForm = () => {
  try {
    // Clear previous errors
    Object.keys(errors).forEach((key) => (errors[key] = ""));

    // Parse the form data
    formSchema.parse(state);
    return true; // Validation successful
  } catch (e) {
    console.log(e);
    
    if (e.errors) {
      e.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
    }
    return false; // Validation failed
  }
};

// Handle form submission
const handleSubmit = async () => {

  if (validateForm()) {
    isLoading.value = true
    try {
      let post = await axios.post('http://127.0.0.1:8000/api/posts', {...state})
      toast.success('Post saved successfully.')
      router.push('/')
    } catch (error) {
      toast.error(error.message);
      
    }

  }
};

</script>
<template>

  <form class="max-w-sm mx-auto pt-5" @submit.prevent="handleSubmit">
    <div class="mb-5">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
      <input type="text" v-model="state.title" id="title" name="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Title" required />
        <p v-if="errors.title" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{ errors.title }}</p>
    </div>
    <div class="mb-5">
      <label for="priority" class="block text-sm font-medium text-gray-700">Choose a Priority:</label>
      <select v-model="state.priority" id="priority" name="priority"
        class="mt-1 block w-full px-3 py-2 border border-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <option disabled value="">Select a Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <p v-if="errors.priority" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{ errors.priority }}</p>
    </div>
    <div class="mb-5">
      <label for="due_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
      <!-- Datepicker component styled with Tailwind -->
      <!-- <Datepicker
      v-model="state.due_date"
      placeholder="Pick a date"
      :format="'YYYY-MM-DD'"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    /> -->
      <input type="date" v-model="state.due_date" id="due_date" name="due_date"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Title" required />
     
     <p v-if="errors.due_date" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{ errors.due_date }}</p>

    </div>

    <button type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
  </form>

</template>