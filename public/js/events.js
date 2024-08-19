// CalendarApp class
class CalendarApp {
    constructor() {
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        this.daysInMonth = 0;
        this.startDay = 0;
        this.apts = [];
        this.dayEventBoxEle = null;
        this.dayEventAddForm = null;
        this.eventFilters = [];

        this.months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        this.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        this.calendarView = document.getElementById("calendar-view");
        this.dayView = document.getElementById("day-view");
        this.dayViewDate = document.getElementById("day-view-date");
        this.dayViewExit = document.getElementById("day-view-exit");
        this.currentMonthEle = document.getElementById("current-month");
        this.datesContainer = document.getElementById("dates-container");
        this.footer = document.getElementById("footer");
        this.addEventBtn = document.getElementById("add-event");

        this.init();
    }

    init() {
        this.showCalendar(this.currentYear, this.currentMonth);
        this.addEventListeners();
        this.showDay(this.today);
        this.showFooterDate();
    }

    addEventListeners() {
        this.calendarView.addEventListener("click", this.handleCalendarClick.bind(this));
        this.dayViewExit.addEventListener("click", this.closeDayWindow.bind(this));
        this.addEventBtn.addEventListener("click", this.addNewEventBox.bind(this));
    }

    showCalendar(year, month) {
        this.daysInMonth = new Date(year, month + 1, 0).getDate();
        this.startDay = new Date(year, month, 1).getDay();

        this.currentMonthEle.textContent = `${this.months[month]} ${year}`;
        this.datesContainer.innerHTML = "";

        for (let i = 0; i < this.startDay; i++) {
            const spacer = document.createElement("div");
            spacer.classList.add("date");
            this.datesContainer.appendChild(spacer);
        }

        for (let i = 1; i <= this.daysInMonth; i++) {
            const dateEle = document.createElement("div");
            dateEle.classList.add("date");
            dateEle.textContent = i;
            dateEle.setAttribute("data-date", new Date(year, month, i));
            this.datesContainer.appendChild(dateEle);
        }
    }

    showDay(date) {
        const dayOfMonth = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dayOfWeek = date.getDay();

        this.dayViewDate.textContent = `${this.daysOfWeek[dayOfWeek]}, ${this.months[month]} ${dayOfMonth}, ${year}`;

        const eventsForDay = this.showEventsByDay(date);
        const eventCountText = eventsForDay.length === 0 ? "No events scheduled" : `${eventsForDay.length} events scheduled`;
        document.getElementById("day-events-count").textContent = eventCountText;

        if (eventsForDay.length === 0) {
            const randomQuote = this.getRandomQuote();
            this.dayViewContent.innerHTML = `<p>${randomQuote}</p>`;
        } else {
            this.renderEvents(eventsForDay);
        }

        this.dayView.classList.add("active");
    }

    showEventsByDay(date) {
        const filteredEvents = this.apts.filter(event => {
            const eventDate = event.day;
            return eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate();
        });

        return filteredEvents;
    }

    renderEvents(events) {
        const eventsHTML = events.map((event, index) => {
            const startTime = this.convertTo12HourTime(event.startTime);
            const endTime = this.convertTo12HourTime(event.endTime);
            return `
        <div class="event">
          <p class="event-name">${event.name}</p>
          <p class="event-time">${startTime} - ${endTime}</p>
          <a class="event-delete" data-index="${index}">Delete</a>
        </div>
      `;
        }).join("");

        document.getElementById("day-view-content").innerHTML = eventsHTML;

        const deleteLinks = document.querySelectorAll(".event-delete");
        deleteLinks.forEach(link => {
            link.addEventListener("click", this.deleteEvent.bind(this));
        });
    }

    closeDayWindow() {
        this.dayView.classList.remove("active");
    }

    addNewEventBox() {
        this.dayViewContent.innerHTML = `
      <form id="add-event-form" class="add-event-form">
        <label for="name-event">Event Name:</label>
        <input type="text" id="name-event" name="nameEvent" required>

        <label for="start-time">Start Time:</label>
        <input type="time" id="start-time" name="startTime" required>

        <label for="end-time">End Time:</label>
        <input type="time" id="end-time" name="endTime" required>

        <div class="half">
          <button type="submit" class="event-btn--save event-btn">Save</button>
        </div>
        <div class="half">
          <a tabindex="0" id="add-event-cancel" class="event-btn--cancel event-btn">Cancel</a>
        </div>
      </form>
    `;

        this.dayEventBoxEle = document.getElementById("day-view-content");
        this.dayEventAddForm = document.getElementById("add-event-form");

        this.dayEventAddForm.addEventListener("submit", this.saveAddNewEvent.bind(this));
        const cancelBtn = document.getElementById("add-event-cancel");
        cancelBtn.addEventListener("click", this.closeDayWindow.bind(this));
    }

    saveAddNewEvent(e) {
        e.preventDefault();

        const name = this.dayEventAddForm.nameEvent.value.trim();
        const startTime = this.dayEventAddForm.startTime.value;
        const endTime = this.dayEventAddForm.endTime.value;
        const dayOfDate = this.dayEventBoxEle.getAttribute("data-date");

        const newEvent = {
            name: name,
            day: new Date(dayOfDate),
            startTime: startTime,
            endTime: endTime
        };

        this.apts.push(newEvent);
        this.closeDayWindow();
        this.showDay(new Date(dayOfDate));
    }

    deleteEvent(e) {
        const index = e.target.getAttribute("data-index");
        this.apts.splice(index, 1);
        const dayOfDate = this.dayEventBoxEle.getAttribute("data-date");
        this.showDay(new Date(dayOfDate));
    }

    showFooterDate() {
        const todayDate = this.today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        this.footer.textContent = todayDate;
    }

    convertTo12HourTime(time) {
        const [hour, minute] = time.split(":");
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minute} ${period}`;
    }

    getRandomQuote() {
        const quotes = [
            "The best way to predict the future is to create it.",
            "Do something today that your future self will thank you for.",
            "Life is not about finding yourself. It’s about creating yourself.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "You are never too old to set another goal or to dream a new dream."
        ];

        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    handleCalendarClick(event) {
        const target = event.target;

        if (target.classList.contains("date")) {
            const selectedDate = new Date(target.getAttribute("data-date"));
            this.showDay(selectedDate);
        } else if (target.id === "prev-month") {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentYear--;
                this.currentMonth = 11; // December
            }
            this.showCalendar(this.currentYear, this.currentMonth);
        } else if (target.id === "next-month") {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentYear++;
                this.currentMonth = 0; // January
            }
            this.showCalendar(this.currentYear, this.currentMonth);
        }
    }
}

// Initialize the CalendarApp
const calendarApp = new CalendarApp();
