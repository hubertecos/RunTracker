// Global Variables
let runData = [];
let goals = {
    weeklyDistance: 25,
    monthlyDistance: 100,
    targetPace: "7:45",
    nextRace: {
        type: "10K",
        date: "2025-07-15",
        targetTime: "45:00"
    }
};
let achievements = [];
let userStats = {};
let charts = {}; // Store chart instances for proper cleanup

// Sample data
const sampleData = {
    "sampleRuns": [
        {
            "id": 1,
            "date": "2025-05-29",
            "time": "07:30",
            "distance": 3.2,
            "duration": "00:26:40",
            "averagePace": "8:20",
            "heartRateZones": {"zone1": 2, "zone2": 15, "zone3": 8, "zone4": 1, "zone5": 0},
            "calories": 285,
            "elevationGain": 45,
            "steps": 3840,
            "runningPower": 245,
            "cadence": 178
        },
        {
            "id": 2,
            "date": "2025-05-27",
            "time": "18:15",
            "distance": 5.1,
            "duration": "00:42:30",
            "averagePace": "8:20",
            "heartRateZones": {"zone1": 5, "zone2": 25, "zone3": 12, "zone4": 0, "zone5": 0},
            "calories": 445,
            "elevationGain": 78,
            "steps": 6120,
            "runningPower": 238,
            "cadence": 175
        },
        {
            "id": 3,
            "date": "2025-05-25",
            "time": "06:45",
            "distance": 2.8,
            "duration": "00:22:15",
            "averagePace": "7:57",
            "heartRateZones": {"zone1": 1, "zone2": 12, "zone3": 8, "zone4": 1, "zone5": 0},
            "calories": 248,
            "elevationGain": 32,
            "steps": 3360,
            "runningPower": 265,
            "cadence": 182
        },
        {
            "id": 4,
            "date": "2025-05-23",
            "time": "07:00",
            "distance": 6.2,
            "duration": "00:51:45",
            "averagePace": "8:21",
            "heartRateZones": {"zone1": 8, "zone2": 30, "zone3": 13, "zone4": 0, "zone5": 0},
            "calories": 565,
            "elevationGain": 95,
            "steps": 7440,
            "runningPower": 242,
            "cadence": 176
        },
        {
            "id": 5,
            "date": "2025-05-21",
            "time": "17:30",
            "distance": 4.0,
            "duration": "00:31:20",
            "averagePace": "7:50",
            "heartRateZones": {"zone1": 2, "zone2": 18, "zone3": 10, "zone4": 1, "zone5": 0},
            "calories": 352,
            "elevationGain": 58,
            "steps": 4800,
            "runningPower": 268,
            "cadence": 180
        },
        {
            "id": 6,
            "date": "2025-05-19",
            "time": "08:00",
            "distance": 3.5,
            "duration": "00:28:30",
            "averagePace": "8:08",
            "heartRateZones": {"zone1": 3, "zone2": 18, "zone3": 7, "zone4": 0, "zone5": 0},
            "calories": 310,
            "elevationGain": 40,
            "steps": 4200,
            "runningPower": 250,
            "cadence": 175
        }
    ],
    "goals": {
        "weeklyDistance": 25,
        "monthlyDistance": 100,
        "targetPace": "7:45",
        "nextRace": {
            "type": "10K",
            "date": "2025-07-15",
            "targetTime": "45:00"
        }
    },
    "achievements": [
        {
            "id": "first_5k",
            "name": "First 5K",
            "description": "Completed your first 5K distance",
            "icon": "🏃‍♂️",
            "earned": true,
            "dateEarned": "2025-05-27"
        },
        {
            "id": "speed_demon",
            "name": "Speed Demon",
            "description": "Achieved sub-8:00 pace",
            "icon": "⚡",
            "earned": true,
            "dateEarned": "2025-05-25"
        },
        {
            "id": "early_bird",
            "name": "Early Bird",
            "description": "Completed 5 morning runs",
            "icon": "🌅",
            "earned": true,
            "dateEarned": "2025-05-23"
        },
        {
            "id": "consistency_champ",
            "name": "Consistency Champion",
            "description": "Run 3 times per week for 2 weeks",
            "icon": "🏆",
            "earned": false,
            "progress": 0.7
        },
        {
            "id": "distance_warrior",
            "name": "Distance Warrior",
            "description": "Complete a 10K run",
            "icon": "🎯",
            "earned": false,
            "progress": 0.6
        },
        {
            "id": "streak_master",
            "name": "Streak Master",
            "description": "Maintain a 7-day running streak",
            "icon": "🔥",
            "earned": false,
            "progress": 0.4
        }
    ],
    "userStats": {
        "totalRuns": 42,
        "totalDistance": 156.8,
        "currentStreak": 4,
        "longestStreak": 8,
        "personalRecords": {
            "fastestPace": "7:32",
            "longestRun": 8.2,
            "mostCalories": 685
        }
    }
};

// Utility Functions
function paceToSeconds(pace) {
    if (!pace || typeof pace !== 'string') return 0;
    const [minutes, seconds] = pace.split(':').map(Number);
    return minutes * 60 + (seconds || 0);
}

function secondsToPace(seconds) {
    if (!seconds || isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getMonthStart(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isThisWeek(dateString) {
    const date = new Date(dateString);
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
}

function isThisMonth(dateString) {
    const date = new Date(dateString);
    const monthStart = getMonthStart();
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    return date >= monthStart && date <= monthEnd;
}

// Data Management
function loadData() {
    const savedRuns = localStorage.getItem('runData');
    const savedGoals = localStorage.getItem('goals');
    const savedAchievements = localStorage.getItem('achievements');
    const savedUserStats = localStorage.getItem('userStats');

    if (savedRuns) {
        runData = JSON.parse(savedRuns);
    } else {
        runData = [...sampleData.sampleRuns];
        saveData();
    }

    if (savedGoals) {
        goals = JSON.parse(savedGoals);
    } else {
        goals = {...sampleData.goals};
        saveData();
    }

    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    } else {
        achievements = [...sampleData.achievements];
        saveData();
    }

    if (savedUserStats) {
        userStats = JSON.parse(savedUserStats);
    } else {
        userStats = {...sampleData.userStats};
        saveData();
    }
}

function saveData() {
    localStorage.setItem('runData', JSON.stringify(runData));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function calculateStats() {
    userStats.totalRuns = runData.length;
    userStats.totalDistance = runData.reduce((sum, run) => sum + run.distance, 0);
    
    // Calculate streaks
    const sortedRuns = [...runData].sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 0;
    let currentDate = new Date();
    
    for (let run of sortedRuns) {
        const runDate = new Date(run.date);
        const daysDiff = Math.floor((currentDate - runDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 2) { // Allow for rest days
            currentStreak++;
            currentDate = runDate;
        } else {
            break;
        }
    }
    
    userStats.currentStreak = currentStreak;
    
    // Calculate personal records
    if (runData.length > 0) {
        const fastestPaceSeconds = Math.min(...runData.map(run => paceToSeconds(run.averagePace)));
        userStats.personalRecords.fastestPace = secondsToPace(fastestPaceSeconds);
        userStats.personalRecords.longestRun = Math.max(...runData.map(run => run.distance));
        userStats.personalRecords.mostCalories = Math.max(...runData.map(run => run.calories));
    }
    
    saveData();
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetSection = link.dataset.section;
            
            // Update navigation
            navLinks.forEach(l => l.classList.remove('nav__link--active'));
            link.classList.add('nav__link--active');
            
            // Update sections
            sections.forEach(s => s.classList.remove('section--active'));
            document.getElementById(targetSection).classList.add('section--active');
            
            // Load section-specific data with delay for proper rendering
            setTimeout(() => {
                if (targetSection === 'dashboard') {
                    loadDashboard();
                } else if (targetSection === 'progress') {
                    loadProgressCharts();
                } else if (targetSection === 'goals') {
                    loadGoals();
                } else if (targetSection === 'achievements') {
                    loadAchievements();
                } else if (targetSection === 'advice') {
                    loadAdvice();
                }
            }, 100);
        });
    });
}

// Dashboard Functions
function loadDashboard() {
    updateStatsCards();
    loadRecentRuns();
    updateWeeklyProgress();
    setTimeout(() => createWeeklyChart(), 200);
    showLatestAchievement();
}

function updateStatsCards() {
    document.getElementById('current-streak').textContent = userStats.currentStreak || 0;
    document.getElementById('total-runs').textContent = userStats.totalRuns || 0;
    
    const weeklyDistance = runData
        .filter(run => isThisWeek(run.date))
        .reduce((sum, run) => sum + run.distance, 0);
    document.getElementById('week-distance').textContent = `${weeklyDistance.toFixed(1)} mi`;
    
    const recentRuns = runData.slice(-5);
    if (recentRuns.length > 0) {
        const avgPaceSeconds = recentRuns.reduce((sum, run) => sum + paceToSeconds(run.averagePace), 0) / recentRuns.length;
        document.getElementById('avg-pace').textContent = secondsToPace(avgPaceSeconds);
    } else {
        document.getElementById('avg-pace').textContent = '--:--';
    }
}

function loadRecentRuns() {
    const recentRunsList = document.getElementById('recent-runs-list');
    const recentRuns = runData.slice(-5).reverse();
    
    if (recentRuns.length === 0) {
        recentRunsList.innerHTML = '<p class="text-center">No runs recorded yet. Add your first run!</p>';
        return;
    }
    
    recentRunsList.innerHTML = recentRuns.map(run => `
        <div class="recent-run">
            <div class="recent-run__info">
                <div class="recent-run__date">${formatDate(run.date)}</div>
                <div class="recent-run__details">${run.duration} • ${run.averagePace}/mi</div>
            </div>
            <div class="recent-run__distance">${run.distance} mi</div>
        </div>
    `).join('');
}

function updateWeeklyProgress() {
    const weeklyDistance = runData
        .filter(run => isThisWeek(run.date))
        .reduce((sum, run) => sum + run.distance, 0);
    
    const progressPercent = Math.min((weeklyDistance / goals.weeklyDistance) * 100, 100);
    
    document.getElementById('weekly-progress').style.width = `${progressPercent}%`;
    document.getElementById('progress-current').textContent = weeklyDistance.toFixed(1);
    document.getElementById('progress-goal').textContent = goals.weeklyDistance;
}

function createWeeklyChart() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.weekly) {
        charts.weekly.destroy();
    }
    
    const weekStart = getWeekStart();
    const weekDays = [];
    const weekDistances = [];
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        weekDays.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const dayDistance = runData
            .filter(run => new Date(run.date).toDateString() === day.toDateString())
            .reduce((sum, run) => sum + run.distance, 0);
        weekDistances.push(dayDistance);
    }
    
    charts.weekly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekDays,
            datasets: [{
                label: 'Distance (mi)',
                data: weekDistances,
                backgroundColor: '#1FB8CD',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showLatestAchievement() {
    const latestAchievement = achievements
        .filter(a => a.earned)
        .sort((a, b) => new Date(b.dateEarned) - new Date(a.dateEarned))[0];
    
    if (latestAchievement) {
        const showcase = document.getElementById('latest-achievement');
        document.getElementById('achievement-icon').textContent = latestAchievement.icon;
        document.getElementById('achievement-name').textContent = latestAchievement.name;
        document.getElementById('achievement-desc').textContent = latestAchievement.description;
        showcase.classList.remove('hidden');
    }
}

// Form Handling
function initForm() {
    const form = document.getElementById('add-run-form');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('run-date').value = today;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const requiredFields = ['run-date', 'run-time', 'run-distance', 'run-duration', 'run-pace', 'run-calories'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', validateField);
        }
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove any existing error styling
    field.classList.remove('form-control--error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('form-control--error');
        return false;
    }
    
    // Specific validation for different field types
    if (field.id === 'run-distance' && (isNaN(value) || parseFloat(value) <= 0)) {
        field.classList.add('form-control--error');
        return false;
    }
    
    if (field.id === 'run-pace' && !value.match(/^\d{1,2}:\d{2}$/)) {
        field.classList.add('form-control--error');
        return false;
    }
    
    if (field.id === 'run-duration' && !value.match(/^\d{1,2}:\d{2}$/)) {
        field.classList.add('form-control--error');
        return false;
    }
    
    return true;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['run-date', 'run-time', 'run-distance', 'run-duration', 'run-pace', 'run-calories'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField({target: field})) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    const newRun = {
        id: Date.now(),
        date: document.getElementById('run-date').value,
        time: document.getElementById('run-time').value,
        distance: parseFloat(document.getElementById('run-distance').value),
        duration: document.getElementById('run-duration').value,
        averagePace: document.getElementById('run-pace').value,
        heartRateZones: {
            zone1: parseInt(document.getElementById('zone1').value) || 0,
            zone2: parseInt(document.getElementById('zone2').value) || 0,
            zone3: parseInt(document.getElementById('zone3').value) || 0,
            zone4: parseInt(document.getElementById('zone4').value) || 0,
            zone5: parseInt(document.getElementById('zone5').value) || 0
        },
        calories: parseInt(document.getElementById('run-calories').value),
        elevationGain: parseInt(document.getElementById('run-elevation').value) || 0,
        steps: parseInt(document.getElementById('run-steps').value) || 0,
        runningPower: parseInt(document.getElementById('run-power').value) || 0,
        cadence: parseInt(document.getElementById('run-cadence').value) || 0
    };
    
    runData.push(newRun);
    calculateStats();
    const newAchievements = checkAchievements();
    saveData();
    
    showSuccessModal(newAchievements);
    e.target.reset();
    document.getElementById('run-date').value = new Date().toISOString().split('T')[0];
    
    // Trigger confetti
    createConfetti();
}

// Achievement System
function checkAchievements() {
    let newAchievements = [];
    
    // Check first 5K
    const firstFiveK = achievements.find(a => a.id === 'first_5k');
    if (firstFiveK && !firstFiveK.earned && runData.some(run => run.distance >= 3.1)) {
        firstFiveK.earned = true;
        firstFiveK.dateEarned = new Date().toISOString().split('T')[0];
        newAchievements.push(firstFiveK);
    }
    
    // Check speed demon
    const speedDemon = achievements.find(a => a.id === 'speed_demon');
    if (speedDemon && !speedDemon.earned && runData.some(run => paceToSeconds(run.averagePace) < 480)) {
        speedDemon.earned = true;
        speedDemon.dateEarned = new Date().toISOString().split('T')[0];
        newAchievements.push(speedDemon);
    }
    
    // Check early bird
    const earlyBird = achievements.find(a => a.id === 'early_bird');
    if (earlyBird && !earlyBird.earned) {
        const morningRuns = runData.filter(run => {
            const hour = parseInt(run.time.split(':')[0]);
            return hour >= 5 && hour <= 8;
        });
        if (morningRuns.length >= 5) {
            earlyBird.earned = true;
            earlyBird.dateEarned = new Date().toISOString().split('T')[0];
            newAchievements.push(earlyBird);
        }
    }
    
    // Check distance warrior (10K)
    const distanceWarrior = achievements.find(a => a.id === 'distance_warrior');
    if (distanceWarrior && !distanceWarrior.earned && runData.some(run => run.distance >= 6.2)) {
        distanceWarrior.earned = true;
        distanceWarrior.dateEarned = new Date().toISOString().split('T')[0];
        newAchievements.push(distanceWarrior);
    }
    
    return newAchievements;
}

// Progress Charts
function loadProgressCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    
    setTimeout(() => {
        createDistanceChart();
        createPaceChart();
        createHRZonesChart();
        updatePersonalRecords();
    }, 200);
}

function createDistanceChart() {
    const canvas = document.getElementById('distance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const sortedRuns = [...runData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedRuns.length === 0) {
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    charts.distance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedRuns.map(run => formatDate(run.date)),
            datasets: [{
                label: 'Distance (mi)',
                data: sortedRuns.map(run => run.distance),
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createPaceChart() {
    const canvas = document.getElementById('pace-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const sortedRuns = [...runData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedRuns.length === 0) {
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    charts.pace = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedRuns.map(run => formatDate(run.date)),
            datasets: [{
                label: 'Pace (seconds)',
                data: sortedRuns.map(run => paceToSeconds(run.averagePace)),
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    reverse: true,
                    ticks: {
                        callback: function(value) {
                            return secondsToPace(value);
                        }
                    }
                }
            }
        }
    });
}

function createHRZonesChart() {
    const canvas = document.getElementById('hr-zones-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'];
    const zoneTotals = [0, 0, 0, 0, 0];
    
    runData.forEach(run => {
        if (run.heartRateZones) {
            zoneTotals[0] += run.heartRateZones.zone1 || 0;
            zoneTotals[1] += run.heartRateZones.zone2 || 0;
            zoneTotals[2] += run.heartRateZones.zone3 || 0;
            zoneTotals[3] += run.heartRateZones.zone4 || 0;
            zoneTotals[4] += run.heartRateZones.zone5 || 0;
        }
    });
    
    const totalTime = zoneTotals.reduce((sum, time) => sum + time, 0);
    
    if (totalTime === 0) {
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No heart rate data', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    charts.hrZones = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: zones,
            datasets: [{
                data: zoneTotals,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updatePersonalRecords() {
    document.getElementById('fastest-pace').textContent = userStats.personalRecords?.fastestPace || '--:--';
    document.getElementById('longest-run').textContent = `${userStats.personalRecords?.longestRun || 0} mi`;
    document.getElementById('most-calories').textContent = userStats.personalRecords?.mostCalories || 0;
}

// Goals Management
function loadGoals() {
    document.getElementById('weekly-goal').value = goals.weeklyDistance;
    document.getElementById('monthly-goal').value = goals.monthlyDistance;
    document.getElementById('target-pace').value = goals.targetPace;
    document.getElementById('race-type').value = goals.nextRace.type;
    document.getElementById('race-date').value = goals.nextRace.date;
    document.getElementById('race-time').value = goals.nextRace.targetTime;
    
    updateGoalProgress();
}

function updateGoal(type) {
    if (type === 'weekly') {
        goals.weeklyDistance = parseInt(document.getElementById('weekly-goal').value) || 25;
    } else if (type === 'monthly') {
        goals.monthlyDistance = parseInt(document.getElementById('monthly-goal').value) || 100;
    } else if (type === 'pace') {
        goals.targetPace = document.getElementById('target-pace').value || '7:45';
    }
    
    saveData();
    updateGoalProgress();
}

function updateRaceGoal() {
    goals.nextRace = {
        type: document.getElementById('race-type').value,
        date: document.getElementById('race-date').value,
        targetTime: document.getElementById('race-time').value
    };
    saveData();
}

function updateGoalProgress() {
    // Weekly progress
    const weeklyDistance = runData
        .filter(run => isThisWeek(run.date))
        .reduce((sum, run) => sum + run.distance, 0);
    const weeklyPercent = Math.min((weeklyDistance / goals.weeklyDistance) * 100, 100);
    
    document.getElementById('weekly-goal-progress').style.width = `${weeklyPercent}%`;
    document.getElementById('weekly-current').textContent = weeklyDistance.toFixed(1);
    document.getElementById('weekly-target').textContent = goals.weeklyDistance;
    
    // Monthly progress
    const monthlyDistance = runData
        .filter(run => isThisMonth(run.date))
        .reduce((sum, run) => sum + run.distance, 0);
    const monthlyPercent = Math.min((monthlyDistance / goals.monthlyDistance) * 100, 100);
    
    document.getElementById('monthly-goal-progress').style.width = `${monthlyPercent}%`;
    document.getElementById('monthly-current').textContent = monthlyDistance.toFixed(1);
    document.getElementById('monthly-target').textContent = goals.monthlyDistance;
    
    // Pace comparison
    const recentRuns = runData.slice(-5);
    if (recentRuns.length > 0) {
        const avgPaceSeconds = recentRuns.reduce((sum, run) => sum + paceToSeconds(run.averagePace), 0) / recentRuns.length;
        document.getElementById('current-avg-pace').textContent = secondsToPace(avgPaceSeconds);
    } else {
        document.getElementById('current-avg-pace').textContent = '--:--';
    }
    document.getElementById('target-pace-display').textContent = goals.targetPace;
}

// Achievements Display
function loadAchievements() {
    document.getElementById('current-streak-display').textContent = userStats.currentStreak || 0;
    document.getElementById('longest-streak-display').textContent = userStats.longestStreak || 0;
    
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = achievements.map(achievement => {
        const badgeClass = achievement.earned ? 'badge--earned' : 'badge--progress';
        const statusText = achievement.earned 
            ? `Earned on ${formatDate(achievement.dateEarned)}`
            : `Progress: ${Math.round((achievement.progress || 0) * 100)}%`;
        
        return `
            <div class="badge ${badgeClass}">
                <div class="badge__icon">${achievement.icon}</div>
                <div class="badge__name">${achievement.name}</div>
                <div class="badge__description">${achievement.description}</div>
                <div class="${achievement.earned ? 'badge__earned' : 'badge__progress'}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Advice Generation
function loadAdvice() {
    generateNextRunAdvice();
    generateTrainingAnalysis();
    generateRecoveryAdvice();
    generateRacePredictions();
}

function generateNextRunAdvice() {
    const container = document.getElementById('next-run-advice');
    const recentRuns = runData.slice(-3);
    
    if (recentRuns.length === 0) {
        container.innerHTML = `
            <div class="advice-item">
                <div class="advice-icon">🏃‍♂️</div>
                <div class="advice-text">
                    <div class="advice-title">Start Your Journey</div>
                    <p class="advice-description">Begin with a 20-30 minute easy run to establish your baseline.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const avgDistance = recentRuns.reduce((sum, run) => sum + run.distance, 0) / recentRuns.length;
    const avgPaceSeconds = recentRuns.reduce((sum, run) => sum + paceToSeconds(run.averagePace), 0) / recentRuns.length;
    
    const advice = [
        {
            icon: '📏',
            title: 'Recommended Distance',
            description: `Based on your recent runs, try ${(avgDistance * 1.1).toFixed(1)} miles for your next run.`
        },
        {
            icon: '⏱️',
            title: 'Target Pace',
            description: `Aim for a comfortable ${secondsToPace(avgPaceSeconds + 30)} per mile pace.`
        },
        {
            icon: '🌅',
            title: 'Best Time',
            description: 'Early morning runs show better consistency in your data.'
        }
    ];
    
    container.innerHTML = advice.map(item => `
        <div class="advice-item">
            <div class="advice-icon">${item.icon}</div>
            <div class="advice-text">
                <div class="advice-title">${item.title}</div>
                <p class="advice-description">${item.description}</p>
            </div>
        </div>
    `).join('');
}

function generateTrainingAnalysis() {
    const container = document.getElementById('training-analysis');
    const weeklyDistance = runData
        .filter(run => isThisWeek(run.date))
        .reduce((sum, run) => sum + run.distance, 0);
    
    const analysis = [
        {
            icon: '📊',
            title: 'Weekly Volume',
            description: `You've run ${weeklyDistance.toFixed(1)} miles this week. ${weeklyDistance < goals.weeklyDistance ? 'Consider adding one more run.' : 'Great job hitting your goal!'}`
        },
        {
            icon: '💪',
            title: 'Intensity Balance',
            description: 'Your heart rate data shows good aerobic base building. Add one tempo run per week.'
        },
        {
            icon: '📈',
            title: 'Progress Trend',
            description: runData.length > 5 ? 'Your pace has improved over recent runs. Keep up the consistent training!' : 'Keep logging runs to see your progress trends.'
        }
    ];
    
    container.innerHTML = analysis.map(item => `
        <div class="advice-item">
            <div class="advice-icon">${item.icon}</div>
            <div class="advice-text">
                <div class="advice-title">${item.title}</div>
                <p class="advice-description">${item.description}</p>
            </div>
        </div>
    `).join('');
}

function generateRecoveryAdvice() {
    const container = document.getElementById('recovery-advice');
    
    const recovery = [
        {
            icon: '😴',
            title: 'Rest Days',
            description: 'Take at least 1-2 rest days per week for optimal recovery.'
        },
        {
            icon: '💧',
            title: 'Hydration',
            description: 'Drink water throughout the day, especially after your runs.'
        },
        {
            icon: '🧘‍♂️',
            title: 'Active Recovery',
            description: 'Try light stretching or yoga on rest days to maintain flexibility.'
        }
    ];
    
    container.innerHTML = recovery.map(item => `
        <div class="advice-item">
            <div class="advice-icon">${item.icon}</div>
            <div class="advice-text">
                <div class="advice-title">${item.title}</div>
                <p class="advice-description">${item.description}</p>
            </div>
        </div>
    `).join('');
}

function generateRacePredictions() {
    const container = document.getElementById('race-predictions');
    const recentRuns = runData.slice(-5);
    
    if (recentRuns.length === 0) {
        container.innerHTML = `
            <div class="advice-item">
                <div class="advice-icon">🏃‍♂️</div>
                <div class="advice-text">
                    <div class="advice-title">Build Your Base</div>
                    <p class="advice-description">Complete more runs to get personalized race predictions.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const avgPaceSeconds = recentRuns.reduce((sum, run) => sum + paceToSeconds(run.averagePace), 0) / recentRuns.length;
    
    const predictions = [
        {
            icon: '🏃‍♂️',
            title: '5K Prediction',
            description: `Based on current fitness: ${secondsToPace(avgPaceSeconds - 20)} pace ≈ ${Math.round((avgPaceSeconds - 20) * 3.1 / 60)} minutes`
        },
        {
            icon: '🏃‍♂️',
            title: '10K Prediction',
            description: `Based on current fitness: ${secondsToPace(avgPaceSeconds)} pace ≈ ${Math.round(avgPaceSeconds * 6.2 / 60)} minutes`
        },
        {
            icon: '🎯',
            title: 'Race Goal',
            description: `Your ${goals.nextRace.type} goal of ${goals.nextRace.targetTime} is ${paceToSeconds(goals.targetPace) < avgPaceSeconds ? 'challenging but achievable' : 'very achievable'} with consistent training.`
        }
    ];
    
    container.innerHTML = predictions.map(item => `
        <div class="advice-item">
            <div class="advice-icon">${item.icon}</div>
            <div class="advice-text">
                <div class="advice-title">${item.title}</div>
                <p class="advice-description">${item.description}</p>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function showSuccessModal(newAchievements = []) {
    const modal = document.getElementById('success-modal');
    
    if (newAchievements.length > 0) {
        const achievementSection = document.getElementById('new-achievements');
        const achievementDisplay = document.getElementById('achievement-display');
        
        achievementDisplay.innerHTML = newAchievements.map(achievement => `
            <div class="achievement-display">
                <span class="achievement-icon">${achievement.icon}</span>
                <div>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
        
        achievementSection.classList.remove('hidden');
    } else {
        document.getElementById('new-achievements').classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    
    // Reset modal content
    document.getElementById('new-achievements').classList.add('hidden');
    
    // Switch to dashboard
    document.querySelector('[data-section="dashboard"]').click();
}

// Confetti Animation
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    calculateStats();
    initNavigation();
    initForm();
    loadDashboard();
});

// Export functions for global access
window.updateGoal = updateGoal;
window.updateRaceGoal = updateRaceGoal;
window.closeModal = closeModal;