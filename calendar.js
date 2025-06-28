class ModernCalendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;
        
        this.monthSelect = document.getElementById('monthSelect');
        this.yearSelect = document.getElementById('yearSelect');
        this.calendarDays = document.getElementById('calendarDays');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setInitialValues();
        this.renderCalendar();
    }
    
    setupEventListeners() {
        this.monthSelect.addEventListener('change', (e) => {
            this.selectedMonth = parseInt(e.target.value);
            this.renderCalendar();
        });
        
        this.yearSelect.addEventListener('change', (e) => {
            this.selectedYear = parseInt(e.target.value);
            this.renderCalendar();
        });
    }
    
    setInitialValues() {
        // Set current month and year as selected if they're within range
        if (this.currentYear >= 2024 && this.currentYear <= 2025) {
            this.yearSelect.value = this.currentYear;
            this.selectedYear = this.currentYear;
            
            if (this.currentMonth <= 6) { // 0-6 for Jan-July
                this.monthSelect.value = this.currentMonth;
                this.selectedMonth = this.currentMonth;
            } else {
                this.monthSelect.value = 6; // Default to July if current month is beyond July
                this.selectedMonth = 6;
            }
        } else {
            // Default to first available option
            this.yearSelect.value = 2024;
            this.monthSelect.value = 0;
            this.selectedYear = 2024;
            this.selectedMonth = 0;
        }
    }
    
    renderCalendar() {
        this.calendarDays.innerHTML = '';
        
        const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
        const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
        const prevLastDay = new Date(this.selectedYear, this.selectedMonth, 0);
        
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const daysInPrevMonth = prevLastDay.getDate();
        
        // Add previous month's trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                daysInPrevMonth - i,
                true,
                this.selectedMonth === 0 ? 11 : this.selectedMonth - 1,
                this.selectedMonth === 0 ? this.selectedYear - 1 : this.selectedYear
            );
            this.calendarDays.appendChild(dayElement);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, false, this.selectedMonth, this.selectedYear);
            this.calendarDays.appendChild(dayElement);
        }
        
        // Add next month's leading days
        const totalCells = this.calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(
                day,
                true,
                this.selectedMonth === 11 ? 0 : this.selectedMonth + 1,
                this.selectedMonth === 11 ? this.selectedYear + 1 : this.selectedYear
            );
            this.calendarDays.appendChild(dayElement);
        }
    }
    
    createDayElement(day, isOtherMonth, month, year) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Check if it's today
        if (!isOtherMonth && 
            day === this.currentDate.getDate() && 
            month === this.currentDate.getMonth() && 
            year === this.currentDate.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Check if it's a special date
        if (!isOtherMonth && this.isSpecialDate(day, month, year)) {
            dayElement.classList.add('special-date');
            dayElement.addEventListener('click', () => {
                this.handleSpecialDateClick(day, month, year);
            });
        }
        
        return dayElement;
    }
    
    isSpecialDate(day, month, year) {
        if (specialDates[year] && specialDates[year][month]) {
            return specialDates[year][month].includes(day);
        }
        return false;
    }
    
    handleSpecialDateClick(day, month, year) {
        // Redirect to a placeholder URL - replace with your actual URLs
        let urlStr = '/sessions/'+year.toString()+(month+1).toString().padStart(2,0) +day.toString().padStart(2,0)+'/index.html';
        window.open(urlStr, '_blank');
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModernCalendar();
});