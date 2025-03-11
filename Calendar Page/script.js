const currentDate = new Date();
let selectedDate = new Date(currentDate);
let events = {};

// Array of month names
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Populate month and year dropdowns
window.onload = function () {
    populateMonthYear();
    renderCalendar();
};

function populateMonthYear() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    // Populate months
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Set current month as selected
    monthSelect.value = selectedDate.getMonth();

    // Populate years
    for (let i = 1970; i <= 2100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set current year as selected
    yearSelect.value = selectedDate.getFullYear();
}

// Render the calendar
function renderCalendar() {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = '';

    // Fill in days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarDates.appendChild(emptyCell);
    }

    // Fill in days of the current month
    for (let day = 1; day <= lastDateOfMonth; day++) {
        const dateCell = document.createElement('div');
        dateCell.textContent = day;
        dateCell.onclick = () => addEvent(day);

        const eventKey = `${year}-${month}-${day}`;
        if (events[eventKey]) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = events[eventKey];
            dateCell.classList.add('event-added');
            dateCell.appendChild(eventDiv);
        }

        calendarDates.appendChild(dateCell);
    }
}

// Add an event to the calendar
function addEvent(day) {
    const eventText = prompt(`Enter event for ${months[selectedDate.getMonth()]} ${day}, ${selectedDate.getFullYear()}:`);
    if (eventText) {
        const eventKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${day}`;
        events[eventKey] = eventText;
        renderCalendar(); // Re-render the calendar to show the event
    }
}

// Navigate to the previous month
function prevMonth() {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    updateMonthYearSelectors();
    renderCalendar();
}

// Navigate to the next month
function nextMonth() {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    updateMonthYearSelectors();
    renderCalendar();
}

// Update the month and year when dropdowns change
function changeMonth() {
    const monthSelect = document.getElementById('month-select');
    selectedDate.setMonth(monthSelect.value);
    renderCalendar();
}

function changeYear() {
    const yearSelect = document.getElementById('year-select');
    selectedDate.setFullYear(yearSelect.value);
    renderCalendar();
}

// Update the month and year dropdowns to reflect the current date
function updateMonthYearSelectors() {
    document.getElementById('month-select').value = selectedDate.getMonth();
    document.getElementById('year-select').value = selectedDate.getFullYear();
}
