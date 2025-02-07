document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTable = document.getElementById("taskTable");

// Add task on button click
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        showToast("Please enter a task", "red");
        return;
    }

    const task = { text: taskText, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = "";
    showToast("Task added successfully!", "green");
});

// Load tasks from localStorage on page load
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(addTaskToDOM);
}

// Add a task to the table
function addTaskToDOM(task) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="checkbox" ${task.completed ? "checked" : ""}></td>
        <td class="${task.completed ? "complete" : ""}">${task.text}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    const checkbox = row.querySelector("input");
    const taskText = row.querySelector("td:nth-child(2)");
    const deleteBtn = row.querySelector(".delete-btn");

    // Checkbox event to mark as complete
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        taskText.classList.toggle("complete", task.completed);
        updateLocalStorage();
    });

    // Delete task event
    deleteBtn.addEventListener("click", () => {
        row.remove();
        removeTaskFromLocalStorage(task.text);
        showToast("Task deleted!", "orange");
    });

    taskTable.appendChild(row);
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update localStorage after checkbox change
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll("#taskTable tr").forEach(row => {
        const text = row.querySelector("td:nth-child(2)").innerText;
        const completed = row.querySelector("input").checked;
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show a toast notification
function showToast(message, color) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: color,
    }).showToast();
}
