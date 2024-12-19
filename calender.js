import { db, app } from './firebase.js';
import { collection, setDoc, doc, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

var selectedDate = null;
var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function () {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Array of image URLs for each month
    const monthImages = [
        "./images/calendar/Jan.jpeg",
        "./images/calendar/Feburary.jpeg",
        "./images/calendar/March.jpeg",
        "./images/calendar/april.jpeg",
        "./images/calendar/May.jpeg",
        "./images/calendar/June.jpeg",
        "./images/calendar/July.jpeg",
        "./images/calendar/August.jpeg",
        "./images/calendar/september.jpeg",
        "./images/calendar/October.jpeg",
        "./images/calendar/November.jpeg",
        "./images/calendar/December.jpeg"
    ];

    const monthYear = document.getElementById('month-year');
    const calendarDates = document.querySelector('.calendar__dates');
    const calendarHeader = document.querySelector('.calendar__header');

    function renderCalendar(month, year) {
        calendarDates.innerHTML = '';
        monthYear.textContent = `${monthNames[month]} ${year}`;

        // Update the background image based on the current month
        calendarHeader.style.backgroundImage = `url(${monthImages[month]})`;

        const firstDay = new Date(year, month).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendarDates.innerHTML += `<div></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateDiv = document.createElement('div');
            dateDiv.textContent = i;
            dateDiv.classList.add('calendar__number');
            dateDiv.addEventListener('click', function () {
                selectDate(dateDiv, i, month, year);
            });
            calendarDates.appendChild(dateDiv);
        }
    }

    function selectDate(element, day, month, year) {
        if (selectedDate) {
            selectedDate.classList.remove('selected');
        }
        element.classList.add('selected');
        selectedDate = element;
        console.log(`Selected date: ${day} ${monthNames[month]} ${year}`);
    }

    document.getElementById('prev-month').addEventListener('click', function () {
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', function () {
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
        renderCalendar(currentMonth, currentYear);
    });

    renderCalendar(currentMonth, currentYear);

    async function recordDate() {
        let time = document.getElementById("time").value;
        let alert = document.getElementById("alert");
        if (time === "") {
            alert.textContent = "What time shall we eat?";
        } else {
            alert.textContent = "";
        }
        if (time !== "" && selectedDate !== null) {
            let selectedDay = selectedDate.textContent;
            let selectedMonth = currentMonth;
            let selectedYear = currentYear;
    
            // Store data in Firestore
            try {
                const docRef = doc(db, 'dates', 'uniqueDocumentId'); // Use a fixed document ID
                await setDoc(docRef, {
                    time: time,
                    date: `${selectedDay} ${monthNames[selectedMonth]} ${selectedYear}`
                }, { merge: true }); // Use merge: true to update the document if it exists
                console.log('Data stored successfully');
                // Redirect to last.html
                window.location.href = "wait.html";
            } catch (error) {
                console.error('Error storing data: ', error);
            }
        }
    }
    
    // Attach recordDate to the window object
    window.recordDate = recordDate;
});



