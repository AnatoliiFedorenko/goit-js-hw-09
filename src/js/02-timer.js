import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  clockfaceDay: document.querySelector('[data-days]'),
  clockfaceHours: document.querySelector('[data-hours]'),
  clockfaceMinutes: document.querySelector('[data-minutes]'),
  clockfaceSeconds: document.querySelector('[data-seconds]'),
  timePicker: document.querySelector('.timepicker'),
};

refs.startBtn.disabled = true;
let selectedTime = 0;
let timerId = null;

function settings() {
  const currentDate = Date.now();

  const deltaTime = selectedTime - currentDate;

  const diffTime = convertMs(deltaTime);

  updateClockface(diffTime);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.clockfaceDay.textContent = `${days}`;
  refs.clockfaceHours.textContent = `${hours}`;
  refs.clockfaceMinutes.textContent = `${minutes}`;
  refs.clockfaceSeconds.textContent = `${seconds}`;
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedTime = selectedDates[0];
    if (selectedDates[0] < Date.now()) {
      Notiflix.Notify.warning('Please choose a date in the future');
      refs.startBtn.disabled = true;
      const diffTime = convertMs(0);
      updateClockface(diffTime);
      return;
    } else refs.startBtn.disabled = false;
    settings();
  },
};

flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', startTimer);

function timer() {
  settings();

  const currentDate = Date.now();

  const deltaTime = selectedTime - currentDate;

  refs.startBtn.disabled = true;
  refs.timePicker.disabled = true;

  if (deltaTime <= 0) {
    clearInterval(timerId);
    Notiflix.Notify.info('Time is out');
    const diffTime = convertMs(0);
    updateClockface(diffTime);
    return;
  }
}

function startTimer() {
  timerId = setInterval(timer, 1000);
}
