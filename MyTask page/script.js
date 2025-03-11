// Show modal
const modal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const closeModal = document.getElementsByClassName('close')[0];
const taskForm = document.getElementById('taskForm');
const taskTableBody = document.getElementById('taskTableBody');

// Task count
let taskCount = 0;
let isEditing = false;
let currentRowToEdit = null;

addTaskBtn.onclick = function() {
    resetForm();
    modal.style.display = "block";
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle task addition/editing
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get values
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskProgress = document.getElementById('taskProgress').value;

    if (isEditing && currentRowToEdit) {
        // Update existing task
        updateTask(currentRowToEdit, taskName, taskDate, taskTime, taskPriority, taskProgress);
        isEditing = false;
        currentRowToEdit = null;
    } else {
        // Increment task count for new tasks
        taskCount++;
        addNewTask(taskName, taskDate, taskTime, taskPriority, taskProgress);
    }

    // Clear modal form
    taskForm.reset();
    modal.style.display = "none";
});

// Add new task row to the table
function addNewTask(taskName, taskDate, taskTime, taskPriority, taskProgress) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${taskCount}</td>
        <td>${taskName}</td>
        <td>${taskDate}</td>
        <td>${taskTime}</td>
        <td>${taskPriority}</td>
        <td class="progress-text">${taskProgress}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="mark-done-btn">Mark Done</button>
        </td>
    `;

    // Set background color based on priority
    setPriorityColor(row, taskPriority);

    // Append row to the table
    taskTableBody.appendChild(row);

    // Add event listeners to the buttons
    row.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(row, taskName, taskDate, taskTime, taskPriority, taskProgress);
    });

    row.querySelector('.mark-done-btn').addEventListener('click', () => {
        markTaskDone(row);
    });
}

// Open modal for editing the task
function openEditModal(row, taskName, taskDate, taskTime, taskPriority, taskProgress) {
    // Populate the form with the task details
    document.getElementById('taskName').value = taskName;
    document.getElementById('taskDate').value = taskDate;
    document.getElementById('taskTime').value = taskTime;
    document.getElementById('taskPriority').value = taskPriority;
    document.getElementById('taskProgress').value = taskProgress;

    // Mark the current row as being edited
    currentRowToEdit = row;
    isEditing = true;

    // Open the modal
    modal.style.display = "block";
}

// Update the task after editing
function updateTask(row, taskName, taskDate, taskTime, taskPriority, taskProgress) {
    row.cells[1].textContent = taskName;
    row.cells[2].textContent = taskDate;
    row.cells[3].textContent = taskTime;
    row.cells[4].textContent = taskPriority;
    row.querySelector('.progress-text').textContent = taskProgress;

    // Update the row background color based on new priority
    setPriorityColor(row, taskPriority);
}

// Mark a task as done
function markTaskDone(row) {
    row.classList.add('completed-task');
    row.querySelector('.progress-text').textContent = "Completed";
}

// Set the background color based on priority
function setPriorityColor(row, taskPriority) {
    if (taskPriority === "High") {
        row.style.backgroundColor = "#ffcdd2";
    } else if (taskPriority === "Medium") {
        row.style.backgroundColor = "#fff9c4";
    } else if (taskPriority === "Low") {
        row.style.backgroundColor = "#c8e6c9";
    }
}

// Reset form when adding a new task
function resetForm() {
    taskForm.reset();
    isEditing = false;
    currentRowToEdit = null;
}
