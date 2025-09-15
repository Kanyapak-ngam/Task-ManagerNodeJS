const API_URL = "http://localhost:3000"; // เปลี่ยนเป็น URL Backend ของคุณ
let token = localStorage.getItem("token"); // เก็บ token

// ------------------ Register ------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    alert(data.message || "สมัครสมาชิกสำเร็จ!");
  });
}

// ------------------ Login ------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  });
}

// ------------------ Dashboard Task CRUD ------------------
const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasksContainer");

async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <strong>${task.title}</strong> [${task.status}] <br>
      ${task.detail || ""} <br>
      <button onclick="editTask(${task.id})">แก้ไข</button>
      <button onclick="deleteTask(${task.id})">ลบ</button>
    `;
    tasksContainer.appendChild(div);
  });
}

if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const detail = document.getElementById("taskDetail").value;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, detail }),
    });

    taskForm.reset();
    fetchTasks();
  });

  fetchTasks();
}

// ------------------ Edit Task ------------------
window.editTask = async (id) => {
  const newTitle = prompt("ชื่อใหม่:");
  const newDetail = prompt("รายละเอียดใหม่:");
  const newStatus = prompt("สถานะ (pending, in-progress, done):");

  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: newTitle, detail: newDetail, status: newStatus }),
  });

  fetchTasks();
};

// ------------------ Delete Task ------------------
window.deleteTask = async (id) => {
  if (!confirm("ลบงานนี้?")) return;
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchTasks();
};
