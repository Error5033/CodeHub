document.addEventListener('DOMContentLoaded', function () {
    const Calendar = {
        currentDate: new Date(),
        calendarContainer: document.querySelector('.calendar-grid'),
        calendarMonthYear: document.querySelector('.calendar-month-year'),
        events: [],
        serverEndpoint: '/api/search-events', 

        init: async function () {
            this.renderDayHeaders();
            this.events = await this.fetchEvents();
            this.generateCalendar(this.currentDate);
            this.attachEventListeners();
        },

        fetchEvents: async function () {
            try {
                const response = await fetch(this.serverEndpoint);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return data.map(event => ({
                    ...event,
                    start_ts: new Date(event.start_ts) 
                }));
            } catch (error) {
                console.error('Error fetching events:', error);
                return [];
            }
        },

        displayEventsOnCalendar: function () {
            this.events.forEach(event => {
                if (isNaN(event.start_ts.getTime())) {
                    console.error(`Invalid date for event: ${event.name}`);
                    return;
                }
                const eventDate = event.start_ts.toISOString().split('T')[0];
                const dayCell = this.calendarContainer.querySelector(`[data-date="${eventDate}"]`);
                if (dayCell) {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event-detail';
                    eventElement.textContent = event.name;
                    dayCell.appendChild(eventElement);
                    dayCell.classList.add('has-event'); // Add this line
                }
            });
        },

        

        renderDayHeaders: function() {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-grid-header';
                dayHeader.textContent = day;
                this.calendarContainer.appendChild(dayHeader);
            });
        },

        generateCalendar: function(date) {
            this.clearCalendar();
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const startDate = monthStart.getDay();
            const endDate = monthEnd.getDate();

            this.calendarMonthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

            for (let i = 0; i < startDate; i++) {
                this.calendarContainer.appendChild(document.createElement('div')).className = 'calendar-day spacer';
            }

            for (let day = 1; day <= endDate; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = day;
                const dateStr = new Date(date.getFullYear(), date.getMonth(), day).toISOString().slice(0, 10);
                dayCell.setAttribute('data-date', dateStr);
                this.calendarContainer.appendChild(dayCell);
            }

            this.displayEventsOnCalendar();
        },

        clearCalendar: function() {
            while (this.calendarContainer.firstChild) {
                this.calendarContainer.removeChild(this.calendarContainer.firstChild);
            }
            this.renderDayHeaders();
        },

        attachEventListeners: function() {
            document.querySelector('.prev-month').addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.generateCalendar(this.currentDate);
            });
            document.querySelector('.next-month').addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.generateCalendar(this.currentDate);
            });
        },
    };

    Calendar.init();
});
