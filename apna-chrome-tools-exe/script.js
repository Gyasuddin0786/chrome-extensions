// ---------- TIME ----------
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const greetingEl = document.getElementById("greeting");

function updateTime() {
  const n = new Date();
  timeEl.textContent = n.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  dateEl.textContent = n.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const h = n.getHours();
  greetingEl.textContent =
    h < 12 ? "Good Morning ☀️" :
    h < 17 ? "Good Afternoon 🌤️" :
    h < 21 ? "Good Evening 🌙" :
    "Good Night 🌌";
}
setInterval(updateTime, 1000);
updateTime();

// ---------- NAME & FOCUS ----------
const nameInput = document.getElementById("nameInput");
const focusInput = document.getElementById("focusInput");

nameInput.value = localStorage.getItem("name") || "";
focusInput.value = localStorage.getItem("focus") || "";

nameInput.oninput = () => localStorage.setItem("name", nameInput.value);
focusInput.oninput = () => localStorage.setItem("focus", focusInput.value);

// ---------- TODOS ----------
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoBox = document.getElementById("todoBox");
const toggleTodo = document.getElementById("toggleTodo");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let todoVisible = localStorage.getItem("todoVisible") !== "false";

todoBox.style.display = todoVisible ? "block" : "none";

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((t, i) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = t;

    const btn = document.createElement("button");
    btn.textContent = "❌";

    btn.addEventListener("click", () => {
      todos.splice(i, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos();
    });

    li.appendChild(span);
    li.appendChild(btn);
    todoList.appendChild(li);
  });
}


todoInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && todoInput.value.trim()) {
    todos.push(todoInput.value.trim());
    localStorage.setItem("todos", JSON.stringify(todos));
    todoInput.value = "";
    renderTodos();
  }
});

toggleTodo.onclick = () => {
  todoVisible = !todoVisible;
  todoBox.style.display = todoVisible ? "block" : "none";
  localStorage.setItem("todoVisible", todoVisible);
};

renderTodos();

// ---------- TOOLS ----------
const toolsGrid = document.getElementById("toolsGrid");
const toolInput = document.getElementById("toolInput");
const toggleTools = document.getElementById("toggleTools");

const defaultTools = [
  "https://github.com",
  "https://chat.openai.com",
  "https://stackoverflow.com",
  "https://developer.mozilla.org",
  "https://leetcode.com",
  "https://google.com"
];

let customTools = JSON.parse(localStorage.getItem("tools")) || [];
let toolsVisible = localStorage.getItem("toolsVisible") !== "false";

toolsGrid.style.display = toolsVisible ? "grid" : "none";

function renderTools() {
  toolsGrid.innerHTML = "";

  // Default tools (no delete)
  defaultTools.forEach(url => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.textContent = new URL(url).hostname;
    toolsGrid.appendChild(a);
  });

  // Custom tools (with delete)
  customTools.forEach((url, i) => {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.textContent = new URL(url).hostname;
    a.style.flex = "1";

    const btn = document.createElement("button");
    btn.textContent = "❌";

    btn.addEventListener("click", () => {
      customTools.splice(i, 1);
      localStorage.setItem("tools", JSON.stringify(customTools));
      renderTools();
    });

    wrap.appendChild(a);
    wrap.appendChild(btn);
    toolsGrid.appendChild(wrap);
  });
}


toolInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && toolInput.value.startsWith("http")) {
    customTools.push(toolInput.value);
    localStorage.setItem("tools", JSON.stringify(customTools));
    toolInput.value = "";
    renderTools();
  }
});

toggleTools.onclick = () => {
  toolsVisible = !toolsVisible;
  toolsGrid.style.display = toolsVisible ? "grid" : "none";
  localStorage.setItem("toolsVisible", toolsVisible);
};

renderTools();

// ---------- WALLPAPER ----------
const fileInput = document.getElementById("fileInput");
const urlInput = document.getElementById("urlInput");

const savedBg = localStorage.getItem("bg");
if (savedBg) document.body.style.backgroundImage = `url(${savedBg})`;

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file || !file.type.startsWith("image/")) return alert("Only image allowed");

  const r = new FileReader();
  r.onload = () => {
    localStorage.setItem("bg", r.result);
    document.body.style.backgroundImage = `url(${r.result})`;
  };
  r.readAsDataURL(file);
};

urlInput.onkeydown = e => {
  if (e.key === "Enter" && urlInput.value.trim()) {
    localStorage.setItem("bg", urlInput.value);
    document.body.style.backgroundImage = `url(${urlInput.value})`;
    urlInput.value = "";
  }
};

// ---------- THEME ----------
const themeBtn = document.getElementById("themeBtn");
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};
