let bookedAppointments = [];

// Fetch booked appointments from the JSON file
fetch('_data/appointments.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    bookedAppointments = data.appointment;
    renderCalendar();
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });

// Define variables
const date = new Date();
const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const selectedDateEl = document.getElementById('selectedDate');
const timeSlots = document.getElementById('timeSlots');
const confirmDateEl = document.getElementById('confirmDate');
const popup = document.getElementById('popup');
const messageEl = document.getElementById('message');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
let selectedTimeSlot = '';

// Render the calendar
function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  monthYear.innerText = `${monthNames[month]} ${year}`;

  calendar.innerHTML = '';

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement('div');
    calendar.appendChild(emptyDiv);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;
    const formattedDate = `${year}-${(month + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    // Check if the day has any booked appointments
    const hasBookedAppointments = bookedAppointments.some(
      (appt) => appt.date === formattedDate,
    );

    dayDiv.classList.add('available');
    dayDiv.addEventListener('click', (event) => selectDate(event, day));
    calendar.appendChild(dayDiv);
  }
}

// Select a date
function selectDate(event, day) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const selectedDate = new Date(year, month, day);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  selectedDateEl.innerText = selectedDate.toLocaleDateString('en-US', options);
  renderTimeSlots(selectedDate);
}

// Render available time slots
function renderTimeSlots(selectedDate) {
  timeSlots.innerHTML = '';
  const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  slots.forEach((slot) => {
    const li = document.createElement('li');
    li.textContent = slot;

    if (checkIfSlotIsBooked(selectedDate, slot)) {
      li.classList.add('unavailable');
      li.style.pointerEvents = 'none';
    } else {
      li.addEventListener('click', () => selectTimeSlot(slot));
    }
    timeSlots.appendChild(li);
  });
}

// Check if a time slot is booked
function checkIfSlotIsBooked(selectedDate, slot) {
  const dateStr = selectedDate.toISOString().split('T')[0];
  return bookedAppointments.some((appt) => {
    const bookedDate = appt.date === dateStr;
    const bookedTime = appt.time;
    return bookedDate && bookedTime === slot;
  });
}

// Select a time slot
function selectTimeSlot(slot) {
  selectedTimeSlot = slot;
  confirmDateEl.innerText = `You selected: ${selectedDateEl.innerText} at ${slot}`;
  popup.classList.remove('hidden');
}

// Confirm appointment
confirmBtn.addEventListener('click', () => {
  const bookedDate = new Date(selectedDateEl.innerText)
    .toISOString()
    .split('T')[0];
  const message = messageEl.value;

  bookedAppointments.push({
    date: bookedDate,
    time: selectedTimeSlot,
    message: message,
  });
  console.warn('Saving data requires backend support.');

  renderCalendar();
  popup.classList.add('hidden');
});

// Cancel appointment
cancelBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Navigation buttons for changing the month
prevMonthBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
