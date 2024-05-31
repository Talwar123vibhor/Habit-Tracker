document.addEventListener("DOMContentLoaded", function() {
    loadHabits();
    setMidnightReset(); // Set the midnight reset for IST
});

let habitData = {};

function addHabit() {
    const habitInput = document.getElementById('task-input');
    const habitName = habitInput.value;
    if (habitName.trim() === '') return;

    const habit = { name: habitName, id: Date.now().toString(), completed: 0, dates: [] };
    habitData[habit.id] = habit;
    saveHabits();
    addHabitToDOM(habit);
    habitInput.value = '';
    updateGraph(); // Update graph when habit is added
}

function addHabitToDOM(habit) {
    const habitList = document.getElementById('task-list');

    const habitItem = document.createElement('div');
    habitItem.className = 'habit-item';
    habitItem.id = habit.id;
    habitItem.innerHTML = `
        <span>${habit.name}</span>
        <input type="checkbox" onclick="toggleHabit('${habit.id}')">
        <button onclick="deleteHabit('${habit.id}')">Delete</button>
    `;

    habitList.appendChild(habitItem);
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habitData));
}

function loadHabits() {
    habitData = JSON.parse(localStorage.getItem('habits')) || {};
    for (let id in habitData) {
        addHabitToDOM(habitData[id]);
    }
    updateGraph();
}

function deleteHabit(id) {
    delete habitData[id];
    saveHabits();
    document.getElementById(id).remove();
    updateGraph(); // Update graph when habit is deleted
}

function toggleHabit(habitId) {
    const habit = habitData[habitId];
    const today = new Date().toISOString().split('T')[0];

    if (habit.dates.includes(today)) {
        habit.completed -= 1;
        habit.dates = habit.dates.filter(date => date !== today);
    } else {
        habit.completed += 1;
        habit.dates.push(today);
    }
    
    saveHabits();
    updateGraph(); // Update graph when habit is toggled
}

function resetHabits() {
    for (let id in habitData) {
        habitData[id].dates = [];
        habitData[id].completed = 0;
    }
    saveHabits();
    updateGraph(); // Update graph when habits are reset
}

function setMidnightReset() {
    const now = new Date();
    const midnightIST = new Date(now);
    midnightIST.setUTCHours(18, 30, 0, 0); // 00:00 IST in UTC time

    if (now > midnightIST) {
        midnightIST.setDate(midnightIST.getDate() + 1);
    }

    const timeUntilMidnight = midnightIST - now;
    setTimeout(() => {
        resetHabits();
        setInterval(resetHabits, 86400000); // Reset every 24 hours after that
    }, timeUntilMidnight);
}

function updateGraph() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const habitNames = Object.values(habitData).map(habit => habit.name);
    const habitCounts = habitNames.map(name => {
        const habit = Object.values(habitData).find(habit => habit.name === name);
        return habit ? habit.completed : 0;
    });

    if (window.myChart) {
        window.myChart.data.labels = habitNames;
        window.myChart.data.datasets[0].data = habitCounts;
        window.myChart.update({
            duration: 1000, // Animation duration in milliseconds
            easing: 'easeInOutQuad' // Easing function
        });
    } else {
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: habitNames,
                datasets: [{
                    label: 'Days Completed',
                    data: habitCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Habits'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max:21,
                        title: {
                            display: true,
                            text: 'Days Completed'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value) { return value; }
                        }
                    }
                }
            }
        });
    }
}

function signUp() {
    alert("Sign Up functionality to be implemented.");
}

function logIn() {
    alert("Log In functionality to be implemented.");
}
