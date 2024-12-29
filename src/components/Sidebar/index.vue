<script setup>
defineOptions({
  name: 'Sidebar',
})

import {ref} from 'vue';

const props = defineProps({
  isSidebarOpen: Boolean,
  activeFilter: String,
  categories: Array,
  categoriesFilter: String,
});

const categoriesAnimClass = "motion-scale-in-[0] motion-translate-x-in-[0%] motion-translate-y-in-[110%] motion-opacity-in-[0%] motion-duration-[0.87s]/scale motion-duration-[0.32s]/opacity"

const filterMenus = [
  {
    text: 'All',
    icon: 'fas fa-list',
    filter: 'all',
  },
  {
    text: 'Today',
    icon: 'fas fa-calendar-day',
    filter: 'today',
  },
  {
    text: 'Completed',
    icon: 'fas fa-check',
    filter: 'completed',
  },
  {
    text: 'Upcoming',
    icon: 'fas fa-calendar-alt',
    filter: 'upcoming',
  }
]

const emit = defineEmits(['toggleSidebar', 'filterTodos', 'updateCategoriesFilter']);

const toggleSidebar = () => {
  emit('toggleSidebar');
};

const filterTodos = (filter) => {
  emit('filterTodos', filter);
};

const updateCategoriesFilter = (newFilter) => {
  emit('updateCategoriesFilter', newFilter);
  showCategories.value = false;
};

const isActive = (filter) => {
  return props.activeFilter === filter;
};

const isCategoryActive = (category) => {
  return props.categoriesFilter === category;
};

const showCategories = ref(false);

const toggleCategories = () => {
  showCategories.value = !showCategories.value;
};
</script>

<template>
  <div>
    <!-- Bottom Navigation for Mobile -->
    <div
        class="md:hidden fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg border-t-2 border-blue-700 flex justify-around p-2 z-50">
      <div @click="filterTodos('all')" :class="['cursor-pointer', { 'text-yellow-300': isActive('all') }]">
        <i class="fas fa-list"></i>
      </div>
      <div @click="filterTodos('today')" :class="['cursor-pointer', { 'text-yellow-300': isActive('today') }]">
        <i class="fas fa-calendar-day"></i>
      </div>
      <div @click="toggleCategories" class="bg-yellow-300 text-gray-800 p-8 rounded-full -mt-8 h-12 w-12 flex items-center justify-center">
        <i class="fas fa-list-check"></i>
      </div>
      <div @click="filterTodos('completed')" :class="['cursor-pointer', { 'text-yellow-300': isActive('completed') }]">
        <i class="fas fa-check"></i>
      </div>
      <div @click="filterTodos('upcoming')" :class="['cursor-pointer', { 'text-yellow-300': isActive('upcoming') }]">
        <i class="fas fa-calendar-alt"></i>
      </div>
    </div>

    <!-- Categories List for Mobile -->
    <div v-if="showCategories" :class="categoriesAnimClass" class="fixed bottom-16 left-0 right-0 bg-white text-gray-800 shadow-lg border-t-2 border-gray-300 p-4 z-50 m-5">
      <div v-for="category in props.categories" :key="category" @click="updateCategoriesFilter(category)"
           :class="['p-2 cursor-pointer rounded-lg transition-colors duration-300 hover:bg-yellow-300 hover:text-gray-800', { 'bg-yellow-300 text-gray-800': isCategoryActive(category) }]">
        {{ category }}
      </div>
    </div>

    <!-- Sidebar for Desktop -->
    <div
        :class="['sidebar hidden md:flex flex-col gap-8 fixed top-0 left-0 h-full w-full bg-blue-600 text-white shadow-lg border-2 border-blue-700 transition-width duration-300', { 'sidebar-open': props.isSidebarOpen, 'sidebar-closed': !props.isSidebarOpen }]">
      <button @click="toggleSidebar"
              class="m-2 p-2 bg-white text-blue-600 rounded shadow font-bold hover:bg-gray-200 hover:shadow-lg h-10 w-10 flex items-center justify-center">
        <i :class="props.isSidebarOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"></i>
      </button>
      <div class="flex flex-col gap-3 justify-center"
           :class="{'mx-3' : isSidebarOpen ? 'items-center' : !isSidebarOpen}">
        <h1 class="text-gray-300 font-bold" v-if="props.isSidebarOpen">Filter Menu</h1>
        <div @click="filterTodos(menu.filter)" v-for="menu in filterMenus" :key="menu.filter"
             :class="['sidebar-item flex items-center p-2 text-md transition-colors duration-300 hover:bg-yellow-300 hover:text-gray-800 cursor-pointer rounded', { 'bg-yellow-300 !text-gray-800': isActive(menu.filter) }]">
          <i :class="menu.icon" class="transition-colors duration-300 "></i> <span v-if="props.isSidebarOpen"
                                                                            class="ml-2">{{menu.text}}</span>
        </div>
      </div>

      <hr>

      <div class="flex flex-col gap-3 justify-center"
           :class="{'mx-3' : isSidebarOpen ? 'items-center' : !isSidebarOpen}">
        <div class="flex items-center justify-between" v-if="props.isSidebarOpen">
          <h1 class="text-gray-300 font-bold">Categories</h1>
        </div>
        <div v-for="category in props.categories" :key="category" @click="updateCategoriesFilter(category)"
             :class="['sidebar-item flex items-center p-2 text-md transition-colors duration-300 hover:bg-yellow-300 hover:text-gray-800 cursor-pointer rounded', { 'bg-yellow-300 !text-gray-800': isCategoryActive(category) }]">
          <i class="fas fa-list-check transition-colors duration-300 "></i> <span v-if="props.isSidebarOpen"
                                                                           class="ml-2">{{ category }}</span>
        </div>
      </div>

      <!--   Now Date   -->
      <div class="absolute bottom-0 left-0 right-0 text-center p-2 bg-yellow-300 text-gray-800 font-bold">
        {{ props.isSidebarOpen ? new Date().toLocaleDateString() : new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
}

.sidebar-closed {
  width: 60px;
}

.content-shift {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.sidebar-closed + .content-shift {
  margin-left: 60px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .sidebar-closed {
    width: 50px;
  }

  .content-shift {
    margin-left: 0;
  }

  .sidebar-closed + .content-shift {
    margin-left: 0;
  }
}
</style>