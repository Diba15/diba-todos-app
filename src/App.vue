<script setup>
import Todo from "@/components/Todo/index.vue";
import Sidebar from "@/components/Sidebar/index.vue";
import {onMounted, ref} from 'vue';

const isSidebarOpen = ref(false);
const filter = ref('all');
const categoriesFilter = ref('Work');
const categories = ['Work', 'Personal', 'Shopping', 'Others'];

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
    <Sidebar :isSidebarOpen="isSidebarOpen" :activeFilter="filter" :categories="categories" :categoriesFilter="categoriesFilter"
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
