document.addEventListener('DOMContentLoaded', function() {
    const Calendar = {
        currentDate: new Date(),
        calendarContainer: document.querySelector('.calendar-grid'),
        calendarMonthYear: document.querySelector('.calendar-month-year'),
        events: [], // Placeholder for events

        init: async function() {
            this.renderDayHeaders(); // Render day headers immediately
            await this.fetchAndDisplayEvents(); // Fetch events asynchronously
            this.generateCalendar(this.currentDate);
            this.attachEventListeners();
        },

        fetchAndDisplayEvents: async function() {
            try {
                const response = await fetch('/api/economic-events');
                if (!response.ok) throw new Error('Failed to fetch economic events');

                const data = await response.json();
                this.events = data.result.map(event => ({
                    // Adjust these properties to match the Economic Events Calendar API structure
                    date: new Date(event.date), // The event date
                    name: event.title, // The event title
                    comment: event.comment, // The event comment
                    // Other properties can be added as needed
                }));
                this.displayEventsOnCalendar();
            } catch (error) {
                console.error('Error fetching economic events:', error);
            }
        },

        displayEventsOnCalendar: function() {
            this.events.forEach(event => {
                const eventDate = event.date.toISOString().slice(0, 10);
                const dayCell = this.calendarContainer.querySelector(`[data-date="${eventDate}"]`);
                if (dayCell) {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event-detail';
                    eventElement.textContent = event.name; // Display the event name
                    // Tooltip or modal can be added here to show event.comment on hover or click
                    dayCell.appendChild(eventElement);
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
            this.calendarContainer.innerHTML = '';
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

