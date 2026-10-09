/**
 * Student To-Do List Application
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let tasks = JSON.parse(localStorage.getItem('student_tasks')) || [];

  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const validationMessage = document.getElementById('validationMessage');
  const emptyState = document.getElementById('emptyState');
  const taskCounter = document.getElementById('taskCounter');
  const progressFill = document.getElementById('progressFill');

  /**
   * Save task array to LocalStorage
   */
  const saveTasks = () => {
    localStorage.setItem('student_tasks', JSON.stringify(tasks));
  };

  /**
   * Update task counts and progress bar
   */
  const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    taskCounter.textContent = `${completed} of ${total} task${total === 1 ? '' : 's'} completed`;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressFill.style.width = `${percentage}%`;
  };

  /**
   * Show/hide empty state graphic
   */
  const updateEmptyState = () => {
    if (tasks.length === 0) {
      emptyState.classList.add('visible');
      taskList.style.display = 'none';
    } else {
      emptyState.classList.remove('visible');
      taskList.style.display = 'flex';
    }
  };

  /**
   * Create an HTML element for a task item
   */
  const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Checkbox container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'custom-checkbox';

    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.checked = task.completed;
    checkboxInput.setAttribute('aria-label', `Mark "${task.text}" as completed`);

    const checkmarkSpan = document.createElement('span');
    checkmarkSpan.className = 'checkmark';
    checkmarkSpan.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    checkboxLabel.appendChild(checkboxInput);
    checkboxLabel.appendChild(checkmarkSpan);

    // Task text
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    contentDiv.appendChild(checkboxLabel);
    contentDiv.appendChild(textSpan);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.setAttribute('aria-label', `Delete task: "${task.text}"`);
    deleteBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;

    // Event: Toggle status
    checkboxInput.addEventListener('change', () => {
      toggleTask(task.id);
    });

    // Event: Delete task
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    return li;
  };

  /**
   * Render the entire task list to the DOM
   */
  const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskNode = createTaskElement(task);
      taskList.appendChild(taskNode);
    });

    updateEmptyState();
    updateStats();
  };

  /**
   * Add a new task
   */
  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
  };

  /**
   * Toggle task completion status
   */
  const toggleTask = (id) => {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasks();
    renderTasks();
  };

  /**
   * Delete a task by ID
   */
  const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  };

  /**
   * Show error validation message
   */
  const showError = (message) => {
    taskInput.classList.add('invalid');
    validationMessage.textContent = message;
  };

  /**
   * Clear error validation message
   */
  const clearError = () => {
    taskInput.classList.remove('invalid');
    validationMessage.textContent = '';
  };

  // Form submission handler
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = taskInput.value.trim();

    if (value === '') {
      showError('Please enter a task description before adding.');
      taskInput.focus();
      return;
    }

    clearError();
    addTask(value);
    taskInput.value = '';
    taskInput.focus();
  });

  // Clear validation styling when the user types
  taskInput.addEventListener('input', () => {
    if (taskInput.value.trim() !== '') {
      clearError();
    }
  });

  // Initial Render on Page Load
  renderTasks();
});