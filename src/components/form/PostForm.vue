<script setup>
import { reactive, onMounted , ref, watch} from 'vue'
import { useRouter } from 'vue-router';
import {useToast} from 'vue-toast-notification';
import axios from 'axios'
import { z } from 'zod'
import Loader from '../Loader.vue';


let {isEdit, editId, isLoading} = defineProps({
    isEdit: Boolean,
    editId: Number,
    isLoading: Boolean,
})


let form = reactive({
    title: '',
    priority: '',
    due_date: '',
})

let formStatus = ref(isLoading)
let formSubmitStatus = ref(false)
const toast = useToast();

const router = useRouter()



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
    formSchema.parse(form);
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

const updatePost = async () => {
  try {
      let post = await axios.patch(`http://127.0.0.1:8000/api/posts/${editId}`, { ...form })
      toast.success('Post updated successfully.')
      router.push('/')
    } catch (error) {
      toast.error(error.message);

    }
}


const savePost = async () => {
  try {
      let post = await axios.post('http://127.0.0.1:8000/api/posts', {...form})
      toast.success('Post saved successfully.')
      router.push('/')
    } catch (error) {
      toast.error(error.message);
      
    }
}

// Handle form submission
const handleSubmit = async () => {

  if (validateForm()) {
    formSubmitStatus.value = true
    if(isEdit) {
      await new Promise((resolve) => setTimeout(() => resolve(''), 3000));
      await updatePost()
    } else {
      savePost()
    }

  }
};

onMounted( async() => {
  if(isEdit && editId) {
    const post = await axios.get(`http://127.0.0.1:8000/api/posts/${editId}`)
    const { title, priority, due_date } = post.data.post
    form.title = title
    form.priority = priority
    form.due_date = due_date
    formStatus.value = false
  } else {
    formStatus.value = false
  }
  
})
</script>

<template>

<div v-if="formStatus">
  <Loader />
</div >
      <form v-else class="max-w-sm mx-auto pt-5" @submit.prevent="handleSubmit">
    <div class="mb-5">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
      <input type="text" v-model="form.title" id="title" name="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Title" required />
        <p v-if="errors.title" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{ errors.title }}</p>
    </div>
    <div class="mb-5">
      <label for="priority" class="block text-sm font-medium text-gray-700">Choose a Priority:</label>
      <select v-model="form.priority" id="priority" name="priority"
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
      <input type="date" v-model="form.due_date" id="due_date" name="due_date"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Title" required />
     
     <p v-if="errors.due_date" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{ errors.due_date }}</p>

    </div>

    <button :disabled="formSubmitStatus" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
    <span v-if="formSubmitStatus">
      <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg> 
      Loading..

    </span>

    <span v-else>
      Submit
    </span>
    </button>
    
  </form>
</template>