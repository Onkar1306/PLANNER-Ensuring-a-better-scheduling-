// JavaScript for dashboard functionality

// 1. Toggle Notification Dropdown
function toggleNotificationDropdown() {
    const dropdown = document.getElementById("notification-dropdown");
    dropdown.classList.toggle("hidden");
}

// 2. Toggle Profile Dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    dropdown.classList.toggle("hidden");
}

// 3. Add New Task
// function addNewTask() {
//     const task = prompt("Enter new task:");
//     if (task) {
//         const taskList = document.getElementById("task-list");
//         const newTaskItem = document.createElement("li");
//         newTaskItem.textContent = task;
//         taskList.appendChild(newTaskItem);
//     }
// }

// 4. Search Tasks
function searchTasks() {
    const input = document.getElementById("search-input").value.toLowerCase();
    const taskItems = document.querySelectorAll("#task-list li");

    taskItems.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(input)) {
            task.style.display = "";
        } else {
            task.style.display = "none";
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    function showMonthYear() {
        const monthLabel = document.getElementById('monthLabel');
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    function showCalendar() {
        const daysGrid = document.getElementById('calendarDays');
        daysGrid.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            daysGrid.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayButton = document.createElement('button');
            dayButton.textContent = day;

            const taskKey = getTaskKey(currentYear, currentMonth, day);
            if (tasks[taskKey]) {
                dayButton.classList.add('task-added');
            }

            dayButton.addEventListener('click', () => {
                showTaskInputDialog(taskKey, dayButton);
            });

            daysGrid.appendChild(dayButton);
        }

        showMonthYear();
    }

    function getTaskKey(year, month, day) {
        return `${year}-${month + 1}-${day}`;
    }

    function showTaskInputDialog(key, dayButton) {
        const task = prompt('Enter task for this date:', tasks[key] || '');
        if (task) {
            tasks[key] = task;
            dayButton.classList.add('task-added');
        } else {
            delete tasks[key];
            dayButton.classList.remove('task-added');
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    document.getElementById('prevMonth').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        showCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        showCalendar();
    });

    showCalendar();
});
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', 
        height: '100%', // Ensures the calendar takes up 100% of the container's height
        contentHeight: 'auto', // Adjust height to content if needed
        fixedWeekCount: false, // Prevents overflow by fixing the number of weeks shown
    });

    calendar.render();
});
