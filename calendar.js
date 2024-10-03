const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const todayButton = document.getElementById('todayButton'); 
const modal = document.getElementById("myModal");  // กำหนดตัวแปร modal
const modalText = document.getElementById("modalText");  // อ้างอิงถึงเนื้อหาภายในโมดอล
const span = document.getElementsByClassName("close")[0];
const spinner = document.getElementById('spinner');
const refreshButton = document.querySelector('.refresh');

const timeSlots = [
  '0700_0730', '0730_0800', '0800_0830', '0830_0900', '0900_0930', '0930_1000', '1000_1030', '1030_1100', 
  '1100_1130', '1130_1200', '1200_1230', '1230_1300', '1300_1330', '1330_1400', 
  '1400_1430', '1430_1500', '1500_1530', '1530_1600', '1600_1630', '1630_1700', 
  '1700_1730', '1730_1800', '1800_1830', '1830_1900', '1900_1930', '1930_2000'
];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let currentDay = null;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar(month, year) {
  calendarDays.innerHTML = '';
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar-day');
    calendarDays.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');

    if (day === todayDate && month === todayMonth && year === todayYear) {
      dayCell.classList.add('today');
    }

    dayCell.innerHTML = `<p>${day}</p>`;

    dayCell.addEventListener('click', () => {
      currentDay = day; // บันทึกวันที่ปัจจุบันที่เลือก
      loadEventsForDay(year, month + 1, day);
    });

    const requestUrl = `https://script.google.com/macros/s/AKfycbyHILu3V2tHjjWzBTHxOf0iLYUl7lJPEdP0VmaSWgeQv98L7mStw12Hz4_wAvt6IC-I/exec?page=calendar&date=${year}-${('0' + (month + 1)).slice(-2)}-${('0' + day).slice(-2)}`;

    fetch(requestUrl)
      .then(response => response.json())
      .then(events => {
        if (events.length > 0) {
          dayCell.classList.add('has-event');
        }
      })
      .catch(error => {
        console.error(error);
      });

    calendarDays.appendChild(dayCell);
  }
}

function loadEventsForDay(year, month, day) {
  spinner.style.display = 'block';
  const requestUrl = `https://script.google.com/macros/s/AKfycbyHILu3V2tHjjWzBTHxOf0iLYUl7lJPEdP0VmaSWgeQv98L7mStw12Hz4_wAvt6IC-I/exec?page=calendar&date=${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;

  fetch(requestUrl)
    .then(response => response.json())
    .then(events => {
      spinner.style.display = 'none';
      timeSlots.forEach(time => {
        document.getElementById(`somSan_${time}`).textContent = '';
        document.getElementById(`gookSan_${time}`).textContent = '';
        document.getElementById(`pookySan_${time}`).textContent = '';
        document.getElementById(`lSan_${time}`).textContent = '';
      });

      if (events.length === 0) {
        modalText.textContent = "No events for this day.";
        document.getElementById('eventTable').style.display = 'none';
      } else {
        document.getElementById('eventTable').style.display = '';
        events.forEach(event => {
          let timeFromSlot = event.timeFrom.replace(':', '');
          let timeToSlot = event.timeTo.replace(':', '');

          while (timeFromSlot < timeToSlot) {
            let slot = getTimeSlot(timeFromSlot);

            if (slot) {
              if (event.translator === 'SOM SAN') {
                document.getElementById(`somSan_${slot}`).textContent = event.work;
              } else if (event.translator === 'GOOK SAN') {
                document.getElementById(`gookSan_${slot}`).textContent = event.work;
              } else if (event.translator === 'POOKY SAN') {
                document.getElementById(`pookySan_${slot}`).textContent = event.work;
              } else if (event.translator === 'L SAN') {
                document.getElementById(`lSan_${slot}`).textContent = event.work;
              }
            }

            timeFromSlot = incrementTimeSlotBy30Minutes(timeFromSlot);
          }
        });
        modalText.textContent = `Details for ${months[month - 1]} ${day}, ${year}`;
      }

      openModal();
    })
    .catch(error => {
      spinner.style.display = 'none';
      modalText.textContent = "An error occurred while fetching data.";
      openModal();
      console.error(error);
    });
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function getTimeSlot(timeFrom) {
  const slots = {
    '0700': '0700_0730', '0730': '0730_0800', '0800': '0800_0830', '0830': '0830_0900', '0900': '0900_0930', '0930': '0930_1000',
    '1000': '1000_1030', '1030': '1030_1100', '1100': '1100_1130', '1130': '1130_1200',
    '1200': '1200_1230', '1230': '1230_1300', '1300': '1300_1330', '1330': '1330_1400',
    '1400': '1400_1430', '1430': '1430_1500', '1500': '1500_1530', '1530': '1530_1600',
    '1600': '1600_1630', '1630': '1630_1700', '1700': '1700_1730', '1730': '1730_1800',
    '1800': '1800_1830', '1830': '1830_1900', '1900': '1900_1930', '1930': '1930_2000'
  };

  return slots[timeFrom] || null;
}

function incrementTimeSlotBy30Minutes(timeSlot) {
  let hour = parseInt(timeSlot.slice(0, 2));
  let minute = parseInt(timeSlot.slice(2));

  minute += 30;
  if (minute >= 60) {
    minute = 0;
    hour += 1;
  }

  return ('0' + hour).slice(-2) + ('0' + minute).slice(-2);
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar(currentMonth, currentYear);
}

refreshButton.addEventListener('click', () => {
  if (currentDay) {
    loadEventsForDay(currentYear, currentMonth + 1, currentDay);
  }
});

todayButton.addEventListener('click', () => {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  renderCalendar(currentMonth, currentYear);
});

prevMonth.addEventListener('click', () => changeMonth(-1));
nextMonth.addEventListener('click', () => changeMonth(1));

span.onclick = function() {
  closeModal();
}

window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

renderCalendar(currentMonth, currentYear);
