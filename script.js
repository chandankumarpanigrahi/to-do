// Supabase Config (Replace with your actual keys)
const SUPABASE_URL = "https://ppyzqdasvcqrwuojioyb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweXpxZGFzdmNxcnd1b2ppb3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NDE0MDEsImV4cCI6MjA1NDQxNzQwMX0.GMQ1XDn54g6qEilZTY8H5e8uhriTR_eXbbSvCxkjUBg";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTable = document.getElementById("taskTable");

// Load tasks when page loads
async function loadTasks() {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) console.error(error);
    renderTasks(data);
}

// Add new task
addTaskBtn.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const { data, error } = await supabase.from("tasks").insert([{ text: taskText, completed: false }]);

    if (error) console.error(error);
    taskInput.value = "";
});

// Listen for real-time changes
supabase
    .channel("tasks")
    .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        loadTasks(); // Reload tasks on change
    })
    .subscribe();

// Render tasks
function renderTasks(tasks) {
    taskTable.innerHTML = "";
    tasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" ${task.completed ? "checked" : ""}></td>
            <td class="${task.completed ? "complete" : ""}">${task.text}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        const checkbox = row.querySelector("input");
        const deleteBtn = row.querySelector(".delete-btn");

        // Checkbox event
        checkbox.addEventListener("change", async () => {
            await supabase.from("tasks").update({ completed: checkbox.checked }).eq("id", task.id);
        });

        // Delete task event
        deleteBtn.addEventListener("click", async () => {
            await supabase.from("tasks").delete().eq("id", task.id);
        });

        taskTable.appendChild(row);
    });
}

// Load tasks on page load
loadTasks();
