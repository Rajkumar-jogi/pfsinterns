// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const deleteAllButton = document.getElementById('deleteAll');

// Retrieve tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event listener for deleting all tasks
deleteAllButton.addEventListener('click', deleteAllTasks);

// Function to delete all tasks
function deleteAllTasks() {
    localStorage.clear();
    tasks = [];
    renderTasks();
}

// Function to create a task list item
function createTaskItem(task, index) {
    const listItem = document.createElement('li');
    listItem.className = task.completed ? 'completed-task-item' : '';
    listItem.innerHTML = `
        <span class="task-name">${task.text}</span>
        <div>
            <button class='completed-inner-btn' data-index="${index}" data-action="toggle">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class='edit-btn' data-index="${index}" data-action="edit">Edit</button>
            <button class='delete-inner-btn' data-id="${task.taskID}" data-action="delete">Remove</button>
        </div>
    `;
    return listItem;
}

// Function to render tasks based on the filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return filter === 'completed' ? task.completed : !task.completed;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = createTaskItem(task, index);
        taskList.appendChild(taskItem);
    });
}

function getUniqueId() {
    return 'task-' + Math.random().toString(36).slice(2);
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const uID = getUniqueId();
    if (taskText) {
        tasks.push({ taskID: uID, text: taskText, completed: false });
        taskInput.value = '';
        updateTasks();
    }
}

// Function to toggle task completion status
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTasks();
}

// Function to edit an existing task
function editTask(index) {
    const taskItem = tasks[index];
    const taskNameEl = document.getElementsByClassName('task-name')[index];

    // Create an input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = taskItem.text;
    input.classList.add('input');

    // Replace the task text with the input field
    taskNameEl.textContent = '';
    taskNameEl.appendChild(input);

    // Listen for changes in the input field
    input.addEventListener('blur', () => {
        // Save the edited task
        taskItem.text = input.value;
        // Update the UI (revert back to plain text)
        taskNameEl.textContent = taskItem.text;
        // Store the updated task in tasklist
        tasks[index].text = input.value;
        updateTasks();
    });

    // Focus on the input field
    input.focus();
}

// Function to delete a task
function deleteTask(taskID) {
    tasks = tasks.filter(task => task.taskID !== taskID);
    updateTasks();
}

// Function to update tasks in localStorage and re-render the task list
function updateTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Event listener for adding a task on button click
addTaskButton.addEventListener('click', addTask);

// Event listener for adding a task on Enter key press
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Event listeners for filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        renderTasks(filter);
    });
});

// Event delegation for task actions (toggle, edit, delete)
taskList.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    const action = e.target.getAttribute('data-action');
    const taskID = e.target.getAttribute('data-id');

    if (action === 'toggle') toggleTask(index);
    else if (action === 'edit') editTask(index);
    else if (action === 'delete') deleteTask(taskID);
});

// Initial rendering of tasks
renderTasks();
