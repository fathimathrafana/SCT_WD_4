let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDateTime = document.getElementById("taskDateTime");
  const taskPriority = document.getElementById("taskPriority");

  const text = taskInput.value.trim();
  const datetime = taskDateTime.value;
  const priority = taskPriority.value;

  if (!text) return alert("Enter a task name");

  const task = {
    id: Date.now(),
    text,
    datetime,
    priority,
    completed: false
  };

  tasks.push(task);

  taskInput.value = "";
  taskDateTime.value = "";
  taskPriority.value = "";

  renderTasks("all");
  updateStats();
}

function renderTasks(filter = "all") {
  const container = document.getElementById("taskListContainer");
  container.innerHTML = "";

  let filtered = tasks;
  if (filter === "active") filtered = tasks.filter(t => !t.completed);
  if (filter === "completed") filtered = tasks.filter(t => t.completed);

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "done" : ""}`;
    li.setAttribute("data-id", task.id);

    li.innerHTML = `
      <strong>${task.text}</strong><br>
      <small>⏰ ${task.datetime || "No date"} | ⚡ ${task.priority || "None"}</small>
      <div class="actions">
        <button class="done" onclick="toggleComplete(${task.id})">✅</button>
        <button class="edit" onclick="editTask(${task.id})">✏️</button>
        <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    container.appendChild(li);
  });

  updateStats();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  renderTasks("all");
  updateStats();
}

function deleteTask(id) {
  const taskElement = document.querySelector(`.task[data-id="${id}"]`);
  if (taskElement) {
    taskElement.style.opacity = "0";
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks("all");
      updateStats();
    }, 400);
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  const newDatetime = prompt("Edit date & time:", task.datetime);
  const newPriority = prompt("Edit priority (Low, Medium, High):", task.priority);

  if (newText !== null) task.text = newText.trim() || task.text;
  if (newDatetime !== null) task.datetime = newDatetime.trim();
  if (newPriority !== null) task.priority = newPriority.trim();

  renderTasks("all");
  updateStats();
}

function filterTasks(view) {
  renderTasks(view);
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks("all");
  updateStats();
}

function updateStats() {
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("completedCount").textContent = tasks.filter(t => t.completed).length;
  document.getElementById("activeCount").textContent = tasks.filter(t => !t.completed).length;
}
