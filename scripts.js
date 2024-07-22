let productiveHours = 0;
let healthHours = 0;
let unproductiveHours = 0;
let activities = JSON.parse(localStorage.getItem('activities')) || [];

function addActivity() {
    const activityName = document.getElementById('activity-name').value;
    const activityType = document.getElementById('activity-type').value;
    const activityTime = parseFloat(document.getElementById('activity-time').value);

    if (activityName && !isNaN(activityTime)) {
        const activity = {
            name: activityName,
            type: activityType,
            time: activityTime
        };
        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));

        if (activityType === 'productive') {
            productiveHours += activityTime;
            document.getElementById('productive-hours').textContent = productiveHours.toFixed(1);
        } else if (activityType === 'health') {
            healthHours += activityTime;
            document.getElementById('health-hours').textContent = healthHours.toFixed(1);
        } else if (activityType === 'unproductive') {
            unproductiveHours += activityTime;
            document.getElementById('unproductive-hours').textContent = unproductiveHours.toFixed(1);
        }

        // Reset input fields
        document.getElementById('activity-name').value = '';
        document.getElementById('activity-type').value = 'productive';
        document.getElementById('activity-time').value = '';
    } else {
        alert('Please enter valid activity details.');
    }
}

function displayActivities() {
    const activityList = document.getElementById('activities');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const listItem = document.createElement('li');
        listItem.textContent = `${activity.name} (${activity.type}) - ${activity.time} hours`;
        activityList.appendChild(listItem);
    });

    const ctx = document.getElementById('improvementChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Productive', 'Health-Related', 'Unproductive'],
            datasets: [{
                label: 'Hours Spent',
                data: [productiveHours, healthHours, unproductiveHours],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayImprovementAdvice() {
    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';

    // Calculate the most unproductive activity
    const unproductiveActivities = activities.filter(activity => activity.type === 'unproductive');
    const mostUnproductiveActivity = unproductiveActivities.sort((a, b) => b.time - a.time)[0];

    const advice = `
        <li>Focus on increasing time spent on productive activities.</li>
        <li>Allocate specific time slots for health-related activities.</li>
        <li>Avoid spending too much time on unproductive activities like ${mostUnproductiveActivity ? mostUnproductiveActivity.name : 'N/A'}.</li>
    `;

    adviceList.innerHTML = advice;

    displayTimeDistributionChart();
    displayImprovementSuggestions();
}

function displayTimeDistributionChart() {
    const ctx = document.getElementById('timeDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Productive', 'Health-Related', 'Unproductive'],
            datasets: [{
                label: 'Time Distribution',
                data: [productiveHours, healthHours, unproductiveHours],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        },
    });
}

function displayImprovementSuggestions() {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    const totalHours = productiveHours + healthHours + unproductiveHours;
    const productiveGoal = totalHours * 0.5;
    const unproductiveGoal = totalHours * 0.2;

    const productiveSuggestion = `Increase productive hours by ${(productiveGoal - productiveHours).toFixed(1)} hours.`;
    const unproductiveSuggestion = `Reduce unproductive hours by ${(unproductiveHours - unproductiveGoal).toFixed(1)} hours.`;

    const suggestions = `
        <li>${productiveSuggestion}</li>
        <li>${unproductiveSuggestion}</li>
    `;

    suggestionsList.innerHTML = suggestions;
}

// Call functions to display data when the page loads
if (window.location.pathname.endsWith('activities.html')) {
    displayActivities();
}

if (window.location.pathname.endsWith('improve.html')) {
    displayImprovementAdvice();
}
