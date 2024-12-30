<script setup>
import Todo from "@/components/Todo/index.vue";
import Sidebar from "@/components/Sidebar/index.vue";
import {onMounted, ref, watchEffect} from 'vue';
import {useAuth0} from '@auth0/auth0-vue';

const isSidebarOpen = ref(false);
const showDropdown = ref(false);
const filter = ref('all');
const categoriesFilter = ref('Work');
const categories = ['Work', 'Personal', 'Shopping', 'Others'];
const auth0 = useAuth0();
const {loginWithRedirect, logout, isAuthenticated, isLoading, user} = useAuth0();


const login = () => {
  loginWithRedirect();
}

const logOut = () => {
  logout({logoutParams: {returnTo: window.location.origin}});
}

onMounted(() => {
  console.log(isAuthenticated.value, isLoading.value, user.value)
})

watchEffect(() => {
  if (isAuthenticated.value && user.value) {
    console.log('User is authenticated:', user.value);
  } else {
    console.log('User is not authenticated');
  }
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const updateFilter = (newFilter) => {
  filter.value = newFilter;
  localStorage.setItem('filter', newFilter);
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false; // Close sidebar on smaller screens
  }
};

const updateCategoriesFilter = (newFilter) => {
  categoriesFilter.value = newFilter;
  localStorage.setItem('categoriesFilter', newFilter);
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false; // Close sidebar on smaller screens
  }
};

onMounted(() => {
  const savedFilter = localStorage.getItem('filter');
  if (savedFilter) {
    filter.value = savedFilter;
  }
});

onMounted(() => {
  const savedCategoriesFilter = localStorage.getItem('categoriesFilter');
  if (savedCategoriesFilter) {
    categoriesFilter.value = savedCategoriesFilter;
  }
});
</script>

<template>
  <div :class="[{ 'content-shift-open': isSidebarOpen, 'content-shift-closed': !isSidebarOpen }]">
    <div class="flex flex-col justify-end items-end m-4 relative">
      <button v-if="!isAuthenticated" class="text-left px-4 py-2 text-gray-700 hover:bg-gray-100" @click="login">Login</button>
      <div v-else class="flex items-center gap-2 cursor-pointer" @click="showDropdown = !showDropdown">
        <img :src="user?.picture" alt="" class="w-8 h-8 rounded-full">
        <i class="fa-solid fa-chevron-down text-blue-600"></i>
      </div>
      <div v-if="showDropdown" class="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h1 class="block w-full text-left px-4 py-2 text-white bg-blue-600 rounded-t-lg">{{user?.name}}</h1>
        <hr>
        <button v-if="isAuthenticated" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" @click="logOut">Logout</button>
      </div>
    </div>
    <Sidebar :isSidebarOpen="isSidebarOpen" :activeFilter="filter" :categories="categories"
             :categoriesFilter="categoriesFilter"
             @toggleSidebar="toggleSidebar" @filterTodos="updateFilter"
             @updateCategoriesFilter="updateCategoriesFilter"/>
    <Todo :filter="filter" :categoriesFilter="categoriesFilter"/>
  </div>
</template>

<style scoped>
.content-shift-open {
  margin-left: 250px; /* Shift content to the right when sidebar is open */
  transition: margin-left 0.3s ease;
}

.content-shift-closed {
  margin-left: 60px; /* Adjust margin when sidebar is closed */
  transition: margin-left 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .content-shift-open {
    margin-left: 200px; /* Adjust for smaller screens */
  }

  .content-shift-closed {
    margin-left: 0; /* Adjust for smaller screens */
  }
}

@media (max-width: 480px) {
  .content-shift-open {
    margin-left: 0; /* Full width for smaller screens */
  }

  .content-shift-closed {
    margin-left: 0; /* Full width for smaller screens */
  }
}
</style>
