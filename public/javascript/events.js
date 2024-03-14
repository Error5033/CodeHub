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
            const rapidAPIKey = '7500e03755mshd6dfeb9e7696dbep15b2c6jsn463e282ead72';
            const queryKeywords = ['Software']; // The topics you're interested in
            const query = encodeURIComponent(queryKeywords.join(' OR '));
            const url = `https://real-time-events-search.p.rapidapi.com/search-events?query=${query}&start=0`;
        
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '7500e03755mshd6dfeb9e7696dbep15b2c6jsn463e282ead72',
                        'X-RapidAPI-Host': 'real-time-events-search.p.rapidapi.com'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch events');
        
                const data = await response.json();
                this.events = data.data.map(event => ({ // Ensure this matches the API response structure
                    date: new Date(event.start_time), // Convert to Date object
                    name: event.name,
                    description: event.description,
                    link: event.link,
                    // You can add more properties here as needed
                }));
                this.displayEventsOnCalendar();
            } catch (error) {
                console.error('Error fetching events:', error);
                // Here you can update the UI to inform the user that the event fetch has failed
            }
        },
        
        displayEventsOnCalendar: function() {
            this.events.forEach(event => {
                const eventDate = new Date(event.date);
                const dayCell = this.calendarContainer.querySelector(`[data-date="${eventDate.toISOString().slice(0, 10)}"]`);
                if (dayCell) {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event-detail';
                    eventElement.textContent = event.name; // Display the event name
                    // Tooltip or modal can be added here to show event.description on hover or click
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
            const startDate = monthStart.getDay(); // Day of week the month starts on
            const endDate = monthEnd.getDate(); // Last date of the month

            this.calendarMonthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

            // Fill in the blanks for days of the week until the first day of the month
            for (let i = 0; i < startDate; i++) {
                this.calendarContainer.appendChild(document.createElement('div')).className = 'calendar-day spacer';
            }

            // Fill in the actual days of the month
            for (let day = 1; day <= endDate; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = day;
                const dateStr = new Date(date.getFullYear(), date.getMonth(), day).toISOString().slice(0, 10);
                dayCell.setAttribute('data-date', dateStr);
                this.calendarContainer.appendChild(dayCell);
            }

            this.displayEventsOnCalendar(); // Attempt to display events after generating the calendar
        },

        clearCalendar: function() {
            this.calendarContainer.innerHTML = ''; // Clear the calendar HTML
            this.renderDayHeaders(); // Re-render day headers
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
