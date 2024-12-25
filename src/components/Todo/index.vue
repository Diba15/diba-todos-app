<script setup>
import {Notification, Notivue, NotivueSwipe, push} from "notivue";

defineOptions({
  name: 'Todo',
});

const props = defineProps({
  filter: String,
  categoriesFilter: String
});

import {computed, ref, watch} from 'vue';
import {format, isToday, isTomorrow, differenceInDays, addWeeks, addMonths, isSameWeek, isSameMonth} from 'date-fns';

const animationClass = 'motion-preset-bounce'

const todos = ref([]);
if (localStorage.getItem('todos')) {
  todos.value = JSON.parse(localStorage.getItem('todos'));
}
const newTodo = ref('');
const newDueDate = ref(new Date().toISOString().substr(0, 10));
const newCategory = ref('');
const editTodo = ref(null);
const editText = ref('');
const editDueDate = ref('');
const editCategory = ref('');
const searchQuery = ref('');
const sortKey = ref('text');
const sortOrder = ref('asc');
const showCompleted = ref(true);
const showAddTaskForm = ref(false);
const categories = ref(['Work', 'Personal', 'Shopping', 'Others']);

watch(props.filter, () => {
  // Reset to the first page when filter changes
});

function addTodo() {
  if (newTodo.value.trim() !== '' && newDueDate.value.trim() !== '' && newCategory.value.trim() !== '') {
    todos.value.push({
      text: newTodo.value,
      done: false,
      dueDate: newDueDate.value,
      category: newCategory.value,
      priority: false
    });
    localStorage.setItem('todos', JSON.stringify(todos.value));
    push.success({
      title: 'Task added!',
      message: 'New task has been added successfully.',
    });
    newTodo.value = '';
    newDueDate.value = new Date().toISOString().substr(0, 10);
    newCategory.value = '';
    showAddTaskForm.value = false;
  } else {
    push.error({
      title: 'Invalid input!',
      message: 'Please fill all the fields to add a new task.',
    });
  }
}

function toggleTodo(todo) {
  todo.done = !todo.done;
  localStorage.setItem('todos', JSON.stringify(todos.value));

  if (todo.done) {
    push.success({
      title: 'Task marked as completed!',
      message: 'Task has been marked as completed successfully.',
    });
  } else {
    push.info({
      title: 'Task marked as incomplete!',
      message: 'Task has been marked as incomplete successfully.',
    });
  }
}

function removeTodo(index) {
  todos.value.splice(index, 1);
  localStorage.setItem('todos', JSON.stringify(todos.value));

  push.success({
    title: 'Task removed!',
    message: 'Task has been removed successfully.',
  })
}

function startEditing(todo) {
  editTodo.value = todo;
  editText.value = todo.text;
  editDueDate.value = todo.dueDate;
  editCategory.value = todo.category;
}

function saveTodo() {
  if (editTodo.value) {
    editTodo.value.text = editText.value;
    editTodo.value.dueDate = editDueDate.value;
    editTodo.value.category = editCategory.value;
    localStorage.setItem('todos', JSON.stringify(todos.value));
    push.success({
      title: 'Task updated!',
      message: 'Task has been updated successfully.',
    });
    editTodo.value = null;
    editText.value = '';
    editDueDate.value = '';
    editCategory.value = '';
  }
}

function markAllAsComplete() {
  sortedTodos.value.forEach(todo => {
    todo.done = true;
  });
  localStorage.setItem('todos', JSON.stringify(todos.value));
  push.success({
    title: 'All tasks marked as completed!',
    message: 'All tasks have been marked as completed successfully.',
  });
}

function removeAllCompletedTasks() {
  const visibleCompletedTodos = sortedTodos.value.filter(todo => todo.done);
  todos.value = todos.value.filter(todo => !visibleCompletedTodos.includes(todo));
  localStorage.setItem('todos', JSON.stringify(todos.value));

  if (visibleCompletedTodos.length) {
    push.success({
      title: 'Completed tasks removed!',
      message: 'All completed tasks have been removed successfully.',
    });
  } else {
    push.info({
      title: 'No completed tasks found!',
      message: 'There are no completed tasks to remove.',
    });
  }
}

function setPriority(todo, priority) {
  todo.priority = priority;
  localStorage.setItem('todos', JSON.stringify(todos.value));
  push.info({
    title: 'Priority updated!',
    message: 'Task priority has been updated successfully.',
  });
}

const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !props.categoriesFilter ||
        (props.categoriesFilter === 'Others' ? !['Work', 'Personal', 'Shopping'].includes(todo.category)
            : todo.category === props.categoriesFilter);
    const matchesCompletion = showCompleted.value || !todo.done;
    const matchesFilter = (props.filter === 'all' && !todo.done) ||
        (props.filter === 'today' && !todo.done && isToday(new Date(todo.dueDate))) ||
        (props.filter === 'completed' && todo.done) ||
        (props.filter === 'upcoming' && !todo.done && new Date(todo.dueDate) > new Date());
    return matchesSearch && matchesCompletion && matchesFilter && matchesCategory;
  });
});

const sortedTodos = computed(() => {
  return filteredTodos.value.slice().sort((a, b) => {
    if (a.priority && !b.priority) {
      return -1;
    } else if (!a.priority && b.priority) {
      return 1;
    } else {
      let result = 0;
      if (a[sortKey.value] < b[sortKey.value]) {
        result = -1;
      } else if (a[sortKey.value] > b[sortKey.value]) {
        result = 1;
      }
      return sortOrder.value === 'asc' ? result : -result;
    }
  });
});

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate);
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isSameWeek(date, new Date())) {
    return format(date, 'EEEE');
  } else if (isSameMonth(date, new Date())) {
    return format(date, 'dd MMM');
  } else if (isSameWeek(date, addWeeks(new Date(), 1))) {
    return 'Next week';
  } else if (isSameMonth(date, addMonths(new Date(), 1))) {
    return format(date, 'dd MMM yyyy');
  } else {
    const daysDifference = differenceInDays(date, new Date());
    if (daysDifference > 0) {
      return `${daysDifference} days again`;
    } else {
      return format(date, 'yyyy-MM-dd');
    }
  }
};
</script>

<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item"/>
    </NotivueSwipe>
  </Notivue>

  <div class="m-4 md:m-10">
    <div class="my-4">
      <h1 v-if="filter !== 'all'" class="font-bold text-blue-600">
        {{ filter === 'today' ? 'Today\'s Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1) }}</h1>
      <h1 class="text-2xl md:text-3xl font-bold text-blue-600">{{categoriesFilter}} - To Do List</h1>
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between mt-4">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-2">
        <button v-if="filter === 'completed'" @click="removeAllCompletedTasks" class="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600">
          Remove All Completed Tasks
        </button>
        <button v-else @click="markAllAsComplete" class="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600">
          Mark All as Complete
        </button>
        <input v-model="searchQuery" placeholder="Search tasks"
               class="border border-gray-300 p-2 rounded-lg shadow-inner min-w-full md:min-w-72 focus:border-blue-500 outline-none"/>
      </div>
    </div>
    <div v-if="sortedTodos.length" class="rounded-xl w-full md:w-screen-md min-h-2xl mt-4 text-white">
      <div v-for="(todo, index) in sortedTodos" :key="index" :class="animationClass">
        <div v-if="editTodo !== todo"
             :class="{
     'bg-yellow-100 !text-gray-800': todo.priority,
     'bg-white !text-gray-800': !todo.priority,
   }"
             class="flex justify-between items-center border-b p-4 rounded-xl relative group m-2">
          <div class="flex flex-col items-center">
            <div class="flex items-center">
              <button @click="toggleTodo(todo)"
                      class="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-2"
                      :class="{'bg-blue-500 border-blue-500': todo.done}">
                <i v-if="todo.done" class="fas fa-check text-white"></i>
              </button>
              <div>
                <div>
        <span v-if="editTodo !== todo" class="cursor-pointer"
              :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                </div>
                <div>
                  <div>
          <span v-if="editTodo !== todo" :class="{
              '!text-green-500': isToday(new Date(todo.dueDate)),
              'text-yellow-500': isTomorrow(new Date(todo.dueDate)),
              'text-purple-500': isSameWeek(new Date(todo.dueDate), new Date()),
              'text-gray-500': !isToday(new Date(todo.dueDate)) && !isTomorrow(new Date(todo.dueDate)) && !isSameWeek(new Date(todo.dueDate), new Date())
            }"
                class="cursor-pointer text-sm flex gap-2 items-center"><i
              class="fas fa-calendar"></i> {{ formatDueDate(todo.dueDate) }}
          </span>
                  </div>
                  <div>
                    <span v-if="editTodo !== todo" class="cursor-pointer text-sm">{{ todo.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
              class="absolute right-2 inset-y-0 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button @click="setPriority(todo, !todo.priority)"
                    class="text-gray-500 p-1 ml-2 w-10 rounded-xl hover:text-yellow-500">
              <i class="fas fa-star" :class="{'text-yellow-500' : todo.priority}"></i>
            </button>
            <button v-if="editTodo !== todo" @click="startEditing(todo)"
                    class="text-gray-500 p-1 ml-2 w-10 rounded-xl hover:text-yellow-600">
              <i class="fas fa-edit"></i>
            </button>
            <button v-else @click="saveTodo" class="text-gray-500 p-1 ml-2 w-10 rounded-xl hover:text-green-600">
              <i class="fas fa-save"></i>
            </button>
            <button @click="removeTodo(index)" class="text-gray-500 p-1 ml-2 w-10 rounded-xl hover:text-red-600">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div v-else
             class="mt-4 flex flex-col rounded-xl w-full min-h-min border-2 border-gray-200 bg-white text-gray-800">
          <input v-model="editText" placeholder="Edit task"
                 class="p-4 rounded-t-xl flex-1 focus:border-blue-500 outline-none"/>
          <hr>
          <div class="flex flex-col md:flex-row gap-2 justify-start md:justify-between p-3">
            <div class="flex gap-2">
              <input v-model="editDueDate" type="date"
                     class="p-3 max-w-min flex-1 focus:border-blue-500 custom-pointer outline-none"/>
              <select v-model="editCategory"
                      class="p-3 flex-1 max-w-min hover:bg-gray-100 custom-pointer focus:border-blue-500 outline-none">
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="editTodo = null"
                      class="min-w-24 rounded-xl bg-gray-500 text-white py-2 px-5 shadow-md hover:bg-gray-600 flex-1">
                Cancel
              </button>
              <button @click="saveTodo"
                      class="min-w-24 rounded-xl bg-blue-500 text-white py-2 px-5 shadow-md hover:bg-blue-600 flex-1">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-4">
      No tasks available or Not Found. Please add a new task.
    </div>
    <div class="mt-4 flex justify-center" v-show="filter !== 'completed'">
      <button @click="showAddTaskForm = !showAddTaskForm" v-if="!showAddTaskForm"
              class="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600">
        + Add Task
      </button>
    </div>
    <div v-if="showAddTaskForm" v-show="filter !== 'completed'"
         class="mt-4 flex flex-col rounded-xl w-full min-h-min border-2 border-gray-200 bg-white">
      <input v-model="newTodo" placeholder="Add a new task"
             class="p-4  rounded-t-xl flex-1 focus:border-blue-500 outline-none"/>
      <hr>
      <div class="flex flex-col md:flex-row gap-2 justify-start md:justify-between p-3">
        <div class="flex gap-2">
          <input v-model="newDueDate" type="date"
                 class="p-3 max-w-min flex-1 focus:border-blue-500 custom-pointer outline-none"/>
          <select v-model="newCategory"
                  class="p-3 flex-1 max-w-min hover:bg-gray-100 custom-pointer focus:border-blue-500 outline-none">
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button @click="showAddTaskForm = false"
                  class="min-w-24 rounded-xl bg-gray-500 text-white py-2 px-5 shadow-md hover:bg-gray-600 flex-1">Cancel
          </button>
          <button @click="addTodo"
                  class="min-w-24 rounded-xl bg-blue-500 text-white py-2 px-5 shadow-md hover:bg-blue-600 flex-1">Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>