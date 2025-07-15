// Detect workspace
const isTeam = window.location.pathname.includes("team");
const storageKey = isTeam ? "team-tasks" : "personal-tasks";

// Initial board structure
let boardData = JSON.parse(localStorage.getItem(storageKey)) || {
  "backlog": [],
  "todo": [],
  "in-progress": [],
  "review": [],
  "done": []
};

// DOM references
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const targetColumnInput = document.getElementById('targetColumn');
let editingTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  renderAllTasks();
  initializeDragAndDrop();
  setupAssigneeSelection();
});

// =====================
// Modal open/close logic
// =====================

function openTaskModal(columnId, task = null) {
  targetColumnInput.value = columnId;

  if (task) {
    editingTaskId = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDueDate').value = task.due ? new Date(task.due).toISOString().split('T')[0] : '';
    document.querySelectorAll('.assignee-option').forEach(opt => {
      opt.classList.toggle('selected', task.assigned.includes(opt.dataset.userId));
    });
    document.querySelector('.submit-btn').textContent = "Update Task";
  } else {
    editingTaskId = null;
    taskForm.reset();
    document.querySelectorAll('.assignee-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.submit-btn').textContent = "Add Task";
  }

  taskModal.classList.add('active');
}

function closeTaskModal() {
  taskModal.classList.remove('active');
  taskForm.reset();
  editingTaskId = null;
  document.querySelectorAll('.assignee-option').forEach(opt => opt.classList.remove('selected'));
}

// =====================
// Add or update task
// =====================

function addNewTask() {
  // Always refresh board data before writing
  boardData = JSON.parse(localStorage.getItem(storageKey)) || boardData;

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const columnId = targetColumnInput.value;
  const assignedUsers = Array.from(document.querySelectorAll('.assignee-option.selected')).map(opt => opt.dataset.userId);

  if (!title.trim()) {
    alert("Please enter a task title");
    return;
  }

  if (editingTaskId) {
    // Edit existing task
    for (const colId in boardData) {
      const task = boardData[colId].find(t => t.id === editingTaskId);
      if (task) {
        task.title = title;
        task.description = description;
        task.due = dueDate ? new Date(dueDate).toLocaleDateString() : '';
        task.assigned = assignedUsers;
        break;
      }
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now(),
      title,
      description,
      due: dueDate ? new Date(dueDate).toLocaleDateString() : '',
      assigned: assignedUsers,
      comments: 0
    };

    if (!boardData[columnId]) boardData[columnId] = [];
    boardData[columnId].push(newTask); // ✅ This line was missing earlier
  }

  saveBoard();
  renderAllTasks();
  closeTaskModal();
}

function editTask(taskId) {
  for (const colId in boardData) {
    const task = boardData[colId].find(t => t.id === taskId);
    if (task) {
      openTaskModal(colId, task);
      return;
    }
  }
  alert("Task not found");
}

function deleteTask(taskId) {
  for (const colId in boardData) {
    const index = boardData[colId].findIndex(t => t.id === taskId);
    if (index !== -1) {
      if (confirm("Are you sure you want to delete this task?")) {
        boardData[colId].splice(index, 1); // Remove task
        saveBoard();
        renderTasksForColumn(colId); // Re-render only the affected column
      }
      return;
    }
  }
  alert("Task not found");
}


// =====================
// Task render functions
// =====================

function renderAllTasks() {
  for (const columnId in boardData) {
    renderTasksForColumn(columnId);
  }
}

function renderTasksForColumn(columnId) {
  const column = document.querySelector(`.column[data-column-id="${columnId}"]`);
  if (!column) return;

  const taskList = column.querySelector('.task-list');
  taskList.innerHTML = '';

  boardData[columnId].forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  const countElement = column.querySelector('.task-count');
  if (countElement) countElement.textContent = boardData[columnId].length;
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.setAttribute('draggable', 'true');
  taskElement.dataset.taskId = task.id;

  let assignedHTML = '';
  task.assigned?.forEach(userId => {
    const user = getUserDetails(userId);
    assignedHTML += `<div class="assignee" style="background-color:${user.bg};color:${user.text}" title="${user.name}">${user.initials}</div>`;
  });

  const statusHTML = task.due
    ? `<span class="due-date text-xs text-gray-500">Due: ${task.due}</span>` : '';

  const metaHTML = (task.comments || task.attachments) ? `
    <div class="task-meta">
      ${task.comments ? `<span class="meta-item"><i class="fas fa-comment"></i> ${task.comments}</span>` : ''}
      ${task.attachments ? `<span class="meta-item"><i class="fas fa-paperclip"></i> ${task.attachments}</span>` : ''}
    </div>` : '';

  taskElement.innerHTML = `
    <div class="task-header flex justify-between">
      <div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description text-sm text-gray-500">${task.description || ''}</p>
      </div>
      <div class="flex space-x-2">
        <button class="text-blue-500" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
        <button class="text-red-500" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="task-footer mt-2 flex justify-between items-center">
      <div class="assignees flex space-x-1">${assignedHTML}</div>
      ${statusHTML}
    </div>
    ${metaHTML}
  `;

  taskElement.addEventListener('dragstart', dragStart);
  taskElement.addEventListener('dragend', dragEnd);

  return taskElement;
}

// =====================
// Drag & Drop logic
// =====================

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
  e.currentTarget.classList.add('dragging');
  document.querySelectorAll('.column').forEach(col => col.classList.add('drop-zone'));
}

function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.column').forEach(col => col.classList.remove('drop-zone'));
}

function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); e.currentTarget.classList.add('drop-zone-active'); }
function dragLeave(e) { e.currentTarget.classList.remove('drop-zone-active'); }

function drop(e) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('text/plain');
  const targetColumnId = e.currentTarget.dataset.columnId;
  if (!taskId || !targetColumnId) return;

  boardData = JSON.parse(localStorage.getItem(storageKey)) || boardData;

  for (const colId in boardData) {
    const idx = boardData[colId].findIndex(t => t.id == taskId);
    if (idx !== -1) {
      const [task] = boardData[colId].splice(idx, 1);
      boardData[targetColumnId].push(task);
      saveBoard();
      renderTasksForColumn(colId);
      renderTasksForColumn(targetColumnId);
      break;
    }
  }

  e.currentTarget.classList.remove('drop-zone-active');
}

function initializeDragAndDrop() {
  document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('dragenter', dragEnter);
    column.addEventListener('dragleave', dragLeave);
    column.addEventListener('drop', drop);
  });
}

// =====================
// New Column / Board
// =====================

function openNewColumnModal() {
  document.getElementById('newColumnModal').classList.add('active');
  document.getElementById('newColumnName').value = '';
}

function closeNewColumnModal() {
  document.getElementById('newColumnModal').classList.remove('active');
}

function addNewColumn() {
  const name = document.getElementById('newColumnName').value.trim();
  if (!name) return alert("Please enter a name.");

  const columnId = name.toLowerCase().replace(/\s+/g, '-');
  const workspace = isTeam ? 'team' : 'personal';

  boardData = JSON.parse(localStorage.getItem(storageKey)) || boardData;

  if (boardData[columnId]) {
    return alert(`A column named "${name}" already exists locally.`);
  }

  fetch('http://localhost:5000/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, columnId, type: workspace })
  })
    .then(async res => {
      if (!res.ok) {
        let message = "Server error";
        try {
          const text = await res.text();
          if (text) {
            const data = JSON.parse(text);
            message = data.message || message;
          }
        } catch {
          // Non-JSON error
        }
        throw new Error(message);
      }

      // Handle empty body safely
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    })
    .then(board => {
      boardData[columnId] = [];
      saveBoard();

      const boardContainer = document.querySelector('.board-container');
      const newColumn = document.createElement('div');
      newColumn.className = 'column';
      newColumn.setAttribute('data-column-id', columnId);
      newColumn.innerHTML = `
        <div class="column-header">
          <div class="flex justify-between items-center">
            <h3 class="column-title" data-column-id="${columnId}">${name}</h3>
            <div class="space-x-2">
              <button onclick="editColumn('${columnId}')"><i class="fas fa-edit"></i></button>
              <button onclick="deleteColumn('${columnId}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <span class="task-count">0</span>
        </div>
        <div class="task-list"></div>
        <button class="add-task-btn" onclick="openTaskModal('${columnId}')">
          <i class="fas fa-plus mr-2"></i> Add task
        </button>
      `;
      boardContainer.appendChild(newColumn);
      renderTasksForColumn(columnId);
      initializeDragAndDrop();
      closeNewColumnModal();
    })
    .catch(err => {
      console.error('Board creation failed:', err.message);
      alert(err.message || "Something went wrong while creating the board.");
    });
}


// =====================
// Edit & Delete Column
// =====================

function deleteColumn(columnId) {
  if (!confirm("Are you sure you want to delete this column and all its tasks?")) return;
  delete boardData[columnId];
  saveBoard();
  const column = document.querySelector(`.column[data-column-id="${columnId}"]`);
  if (column) column.remove();
}

function editColumn(columnId) {
  const column = document.querySelector(`.column[data-column-id="${columnId}"]`);
  const titleEl = column.querySelector('.column-title');
  const oldName = titleEl.textContent;
  const newName = prompt("Enter a new name for this column:", oldName);
  if (!newName || newName.trim() === '') return;

  const newColumnId = newName.toLowerCase().replace(/\s+/g, '-');
  if (boardData[newColumnId]) return alert("A board with this name already exists.");

  boardData[newColumnId] = boardData[columnId];
  delete boardData[columnId];
  saveBoard();

  column.setAttribute('data-column-id', newColumnId);
  titleEl.textContent = newName;
  titleEl.setAttribute('data-column-id', newColumnId);
  column.querySelector('.add-task-btn').setAttribute('onclick', `openTaskModal('${newColumnId}')`);

  const headerButtons = column.querySelectorAll('.column-header button');
  headerButtons[0].setAttribute('onclick', `editColumn('${newColumnId}')`);
  headerButtons[1].setAttribute('onclick', `deleteColumn('${newColumnId}')`);

  renderTasksForColumn(newColumnId);
}

// =====================
// Utilities
// =====================

function saveBoard() {
  localStorage.setItem(storageKey, JSON.stringify(boardData));
}

function setupAssigneeSelection() {
  document.querySelectorAll('.assignee-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
    });
  });
}

function getUserDetails(userId) {
  const users = {
    'me': { bg: '#c7d2fe', text: '#3730a3', initials: 'Me', name: 'You' },
    'team': { bg: '#fbcfe8', text: '#831843', initials: 'team', name: 'TEAM' },
  };
  return users[userId] || { bg: '#e5e7eb', text: '#4b5563', initials: '??', name: 'Unknown' };
}
