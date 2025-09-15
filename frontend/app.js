const API_BASE = "http://localhost:4000";

// Load users
async function loadUsers() {
  const res = await fetch(`${API_BASE}/users`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.id}: ${u.name} (${u.email})`;
    list.appendChild(li);
  });
}

// Load tasks
async function loadTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.title} [${t.status}] (User ${t.userId})</span>
      <button onclick="deleteTask(${t.id})">❌</button>
    `;
    list.appendChild(li);
  });
}

// Add user
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;

  await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  e.target.reset();
  loadUsers();
});

// Add task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const status = document.getElementById("taskStatus").value;
  const userId = parseInt(document.getElementById("taskUserId").value);

  await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status, userId })
  });

  e.target.reset();
  loadTasks();
});

// Delete task
async function deleteTask(id) {
  await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}

// Init
loadUsers();
loadTasks();
