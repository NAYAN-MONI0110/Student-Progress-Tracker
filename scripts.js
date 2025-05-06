// Global variables
let currentUser = null;
let students = [];
let marks = [];

// Subjects configuration
const subjectsConfig = [
    { name: "English", compulsory: true },
    { name: "physics", compulsory: true },
    { name: "Chemistry", compulsory: true },
    { name: "Mathematics", compulsory: true },
    { name: "Biology", compulsory: true },
];

// DOM Elements
let loginPage;
let app;
let loginForm;
let logoutBtn;
let navLinks;
let pages;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements after page load
    loginPage = document.getElementById('login-page');
    app = document.getElementById('app');
    loginForm = document.getElementById('login-form');
    logoutBtn = document.getElementById('logout-btn');
    navLinks = document.querySelectorAll('.nav-link');
    pages = document.querySelectorAll('.page');
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Check if user is logged in
    if (localStorage.getItem('loggedIn')) {
        loginPage.classList.add('hidden');
        app.classList.remove('hidden');
        showPage('dashboard');
        
        // Set the active nav link
        const dashboardLink = document.querySelector('[data-page="dashboard"]');
        if (dashboardLink) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            dashboardLink.classList.add('active');
        }
    }
    
    // Setup event listeners
    setupEventListeners();
});

function loadFromLocalStorage() {
    const savedStudents = localStorage.getItem('students');
    const savedMarks = localStorage.getItem('marks');
    
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    } else {
        // Sample data if no saved data exists
        students = [
            { id: '1', name: 'John Doe', rollNo: '101', class: '10', section: 'A', dob: '2005-03-15' },
            { id: '2', name: 'Jane Smith', rollNo: '102', class: '10', section: 'B', dob: '2005-05-20' },
            { id: '3', name: 'Mike Johnson', rollNo: '103', class: '9', section: 'A', dob: '2006-02-10' }
        ];
        saveToLocalStorage('students', students);
    }
    
    if (savedMarks) {
        marks = JSON.parse(savedMarks);
    } else {
        // Sample marks if no saved data exists
        marks = [
            { id: '1', studentId: '1', subject: 'English', score: 85, term: 'Term 1' },
            { id: '2', studentId: '1', subject: 'Assamese', score: 78, term: 'Term 1' },
            { id: '3', studentId: '1', subject: 'Alternative English', score: 92, term: 'Term 1' },
            { id: '4', studentId: '2', subject: 'English', score: 90, term: 'Term 1' },
            { id: '5', studentId: '2', subject: 'Assamese', score: 88, term: 'Term 1' },
            { id: '6', studentId: '3', subject: 'English', score: 75, term: 'Term 1' }
        ];
        saveToLocalStorage('marks', marks);
    }
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function setupEventListeners() {
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('loggedIn', 'true');
                loginPage.classList.add('hidden');
                app.classList.remove('hidden');
                showPage('dashboard');
                
                // Set active nav link
                const dashboardLink = document.querySelector('[data-page="dashboard"]');
                if (dashboardLink) {
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    dashboardLink.classList.add('active');
                }
            } else {
                alert('Invalid credentials');
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            app.classList.add('hidden');
            loginPage.classList.remove('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Student management
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            showStudentForm();
        });
    }
    
    const cancelStudentBtn = document.getElementById('cancel-student-btn');
    if (cancelStudentBtn) {
        cancelStudentBtn.addEventListener('click', () => {
            document.getElementById('student-form-modal').classList.add('hidden');
        });
    }
    
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveStudent();
        });
    }
    
    const studentSearch = document.getElementById('student-search');
    if (studentSearch) {
        studentSearch.addEventListener('input', (e) => {
            filterStudents(e.target.value);
        });
    }
    
    // Marks management
    const marksStudent = document.getElementById('marks-student');
    if (marksStudent) {
        marksStudent.addEventListener('change', (e) => {
            loadStudentMarks(e.target.value);
        });
    }
    
    const marksTerm = document.getElementById('marks-term');
    if (marksTerm) {
        marksTerm.addEventListener('change', (e) => {
            const studentId = document.getElementById('marks-student').value;
            if (studentId) {
                loadStudentMarks(studentId);
            }
        });
    }
    
    const saveMarksBtn = document.getElementById('save-marks-btn');
    if (saveMarksBtn) {
        saveMarksBtn.addEventListener('click', saveMarks);
    }
    
    // Reports
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Progress tabs
    const progressTabs = document.querySelectorAll('.tab');
    if (progressTabs) {
        progressTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateProgressChart(tab.getAttribute('data-tab'));
            });
        });
    }
    
    const progressStudent = document.getElementById('progress-student');
    if (progressStudent) {
        progressStudent.addEventListener('change', () => {
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                updateProgressChart(activeTab.getAttribute('data-tab'));
            } else {
                updateProgressChart('subject'); // Default tab
            }
        });
    }
}

function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => page.classList.add('hidden'));
    
    // Show the requested page
    const pageToShow = document.getElementById(`${pageId}-page`);
    if (pageToShow) {
        pageToShow.classList.remove('hidden');
    } else {
        console.error(`Page with ID "${pageId}-page" not found`);
        return;
    }
    
    // Load data for specific pages if needed
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'students') {
        renderStudentList();
    } else if (pageId === 'marks') {
        populateStudentDropdowns();
        const marksStudent = document.getElementById('marks-student');
        if (marksStudent) {
            marksStudent.value = '';
        }
        const marksInputs = document.getElementById('marks-inputs');
        if (marksInputs) {
            marksInputs.innerHTML = '';
        }
    } else if (pageId === 'progress') {
        populateStudentDropdowns();
        updateProgressChart('subject');
    } else if (pageId === 'reports') {
        populateStudentDropdowns();
    }
}

function populateStudentDropdowns() {
    const studentDropdowns = [
        document.getElementById('marks-student'),
        document.getElementById('progress-student'),
        document.getElementById('report-student')
    ].filter(Boolean); // Filter out null values
    
    studentDropdowns.forEach(dropdown => {
        if (!dropdown) return;
        
        // Clear existing options except the first one
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add current students
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.class}-${student.section})`;
            dropdown.appendChild(option);
        });
    });
}

function renderStudentList() {
    const tbody = document.getElementById('students-list');
    if (!tbody) {
        console.error("Students list table body not found");
        return;
    }
    
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-id="${student.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${student.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            editStudent(studentId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

function filterStudents(searchTerm) {
    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
    );
    
    const tbody = document.getElementById('students-list');
    if (!tbody) {
        console.error("Students list table body not found");
        return;
    }
    
    tbody.innerHTML = '';
    
    filtered.forEach(student => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-id="${student.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${student.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Re-add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            editStudent(studentId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

function showStudentForm(student = null) {
    const modal = document.getElementById('student-form-modal');
    const title = document.getElementById('student-form-title');
    const form = document.getElementById('student-form');
    
    if (!modal || !title || !form) {
        console.error("Student form elements not found");
        return;
    }
    
    if (student) {
        title.textContent = 'Edit Student';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-roll').value = student.rollNo;
        document.getElementById('student-class').value = student.class;
        document.getElementById('student-section').value = student.section;
        document.getElementById('student-dob').value = student.dob;
    } else {
        title.textContent = 'Add Student';
        form.reset();
        document.getElementById('student-id').value = '';
    }
    
    modal.classList.remove('hidden');
}

function saveStudent() {
    const form = document.getElementById('student-form');
    if (!form) {
        console.error("Student form not found");
        return;
    }
    
    const studentId = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value;
    const rollNo = document.getElementById('student-roll').value;
    const studentClass = document.getElementById('student-class').value;
    const section = document.getElementById('student-section').value;
    const dob = document.getElementById('student-dob').value;
    
    if (!name || !rollNo || !studentClass || !section || !dob) {
        alert('Please fill in all fields');
        return;
    }
    
    if (studentId) {
        // Update existing student
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students[index] = { 
                id: studentId, 
                name, 
                rollNo, 
                class: studentClass, 
                section, 
                dob 
            };
        }
    } else {
        // Add new student
        const newStudent = {
            id: Date.now().toString(),
            name,
            rollNo,
            class: studentClass,
            section,
            dob
        };
        students.push(newStudent);
    }
    
    // Save to localStorage
    saveToLocalStorage('students', students);
    
    // Update UI
    renderStudentList();
    populateStudentDropdowns();
    
    // Close modal
    const modal = document.getElementById('student-form-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Update dashboard
    updateDashboard();
}

function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        showStudentForm(student);
    }
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        marks = marks.filter(m => m.studentId !== studentId);
        
        // Save to localStorage
        saveToLocalStorage('students', students);
        saveToLocalStorage('marks', marks);
        
        // Update UI
        renderStudentList();
        populateStudentDropdowns();
        
        // If we're on the marks page and deleted the selected student, reset
        const marksPage = document.getElementById('marks-page');
        if (marksPage && !marksPage.classList.contains('hidden')) {
            const marksStudent = document.getElementById('marks-student');
            if (marksStudent && marksStudent.value === studentId) {
                marksStudent.value = '';
                
                const marksInputs = document.getElementById('marks-inputs');
                if (marksInputs) {
                    marksInputs.innerHTML = '';
                }
            }
        }
        
        // Update dashboard
        updateDashboard();
    }
}

function loadStudentMarks(studentId) {
    const marksInputs = document.getElementById('marks-inputs');
    if (!marksInputs) {
        console.error("Marks inputs container not found");
        return;
    }
    
    marksInputs.innerHTML = '';
    
    if (!studentId) return;
    
    const marksTerm = document.getElementById('marks-term');
    if (!marksTerm) {
        console.error("Marks term select not found");
        return;
    }
    
    const term = marksTerm.value;
    const studentMarks = marks.filter(m => m.studentId === studentId && m.term === term);
    
    subjectsConfig.forEach(subjectConfig => {
        if (subjectConfig.compulsory) {
            // For compulsory subjects
            const existingMark = studentMarks.find(m => m.subject === subjectConfig.name);
            
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="mark-${subjectConfig.name.replace(/\s+/g, '-')}">${subjectConfig.name}</label>
                <input type="number" id="mark-${subjectConfig.name.replace(/\s+/g, '-')}" min="0" max="100" 
                       value="${existingMark ? existingMark.score : ''}" required>
            `;
            
            marksInputs.appendChild(div);
        } else {
            // For optional subjects
            const div = document.createElement('div');
            div.className = 'form-group';
            
            // Check which option was previously selected
            let selectedOption = null;
            let selectedScore = '';
            
            subjectConfig.options.forEach(option => {
                const existingMark = studentMarks.find(m => m.subject === option);
                if (existingMark) {
                    selectedOption = option;
                    selectedScore = existingMark.score;
                }
            });
            
            const selectId = `option-${subjectConfig.name.replace(/\s+/g, '-')}`;
            const markId = `mark-${subjectConfig.name.replace(/\s+/g, '-')}`;
            
            div.innerHTML = `
                <label>${subjectConfig.name}</label>
                <select id="${selectId}" class="mb-2" style="width: 100%; padding: 8px;">
                    <option value="">-- Select Option --</option>
                    ${subjectConfig.options.map(option => 
                        `<option value="${option}" ${selectedOption === option ? 'selected' : ''}>${option}</option>`
                    ).join('')}
                </select>
                <input type="number" id="${markId}" min="0" max="100" 
                       value="${selectedScore}" ${selectedOption ? 'required' : 'disabled'}>
            `;
            
            marksInputs.appendChild(div);
            
            // Enable/disable mark input based on option selection
            const select = document.getElementById(selectId);
            const input = document.getElementById(markId);
            
            if (select && input) {
                select.addEventListener('change', (e) => {
                    input.disabled = !e.target.value;
                    if (e.target.value) {
                        input.required = true;
                    } else {
                        input.required = false;
                        input.value = '';
                    }
                });
            }
        }
    });
}

function saveMarks() {
    const marksStudent = document.getElementById('marks-student');
    const marksTerm = document.getElementById('marks-term');
    
    if (!marksStudent || !marksTerm) {
        console.error("Required mark form elements not found");
        return;
    }
    
    const studentId = marksStudent.value;
    const term = marksTerm.value;
    
    if (!studentId) {
        alert('Please select a student');
        return;
    }
    
    const newMarks = [];
    let allValid = true;
    
    // Process compulsory subjects
    subjectsConfig.filter(subject => subject.compulsory).forEach(subject => {
        const markInputId = `mark-${subject.name.replace(/\s+/g, '-')}`;
        const markInput = document.getElementById(markInputId);
        
        if (!markInput) {
            console.error(`Mark input with ID "${markInputId}" not found`);
            return;
        }
        
        const markValue = markInput.value.trim();
        if (markValue === '') {
            alert(`Please enter marks for ${subject.name}`);
            allValid = false;
            return;
        }
        
        const score = parseInt(markValue);
        if (isNaN(score)) {
            alert(`Please enter a valid number for ${subject.name}`);
            allValid = false;
            return;
        }
        
        if (score < 0 || score > 100) {
            alert(`Marks for ${subject.name} must be between 0 and 100`);
            allValid = false;
            return;
        }
        
        newMarks.push({
            subject: subject.name,
            score,
            term,
            studentId
        });
    });
    
    if (!allValid) return;
    
    // Process optional subjects
    subjectsConfig.filter(subject => !subject.compulsory).forEach(subject => {
        const selectId = `option-${subject.name.replace(/\s+/g, '-')}`;
        const markInputId = `mark-${subject.name.replace(/\s+/g, '-')}`;
        
        const select = document.getElementById(selectId);
        const markInput = document.getElementById(markInputId);
        
        if (!select || !markInput) {
            console.error(`Form elements for "${subject.name}" not found`);
            return;
        }
        
        const selectedOption = select.value;
        const markValue = markInput.value.trim();
        
        if (selectedOption && markValue === '') {
            alert(`Please enter marks for ${selectedOption}`);
            allValid = false;
            return;
        }
        
        if (selectedOption) {
            const score = parseInt(markValue);
            if (isNaN(score)) {
                alert(`Please enter a valid number for ${selectedOption}`);
                allValid = false;
                return;
            }
            
            if (score < 0 || score > 100) {
                alert(`Marks for ${selectedOption} must be between 0 and 100`);
                allValid = false;
                return;
            }
            
            newMarks.push({
                subject: selectedOption,
                score,
                term,
                studentId
            });
        }
    });
    
    if (!allValid) return;
    
    // Remove existing marks for this student/term
    marks = marks.filter(m => !(m.studentId === studentId && m.term === term));
    
    // Add new marks with unique IDs
    newMarks.forEach(mark => {
        marks.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // Ensure uniqueness
            ...mark
        });
    });
    
    // Save to localStorage
    saveToLocalStorage('marks', marks);
    
    alert('Marks saved successfully');
    
    // Update dashboard and progress charts
    updateDashboard();
    
    const progressPage = document.getElementById('progress-page');
    if (progressPage && !progressPage.classList.contains('hidden')) {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            updateProgressChart(activeTab.getAttribute('data-tab'));
        } else {
            updateProgressChart('subject'); // Default
        }
    }
}

function updateDashboard() {
    const totalStudentsEl = document.getElementById('total-students');
    const averageScoreEl = document.getElementById('average-score');
    const topPerformerEl = document.getElementById('top-performer');
    
    if (!totalStudentsEl || !averageScoreEl || !topPerformerEl) {
        console.error("Dashboard elements not found");
        return;
    }
    
    // Update stats
    totalStudentsEl.textContent = students.length;
    
    // Calculate average score
    let totalScore = 0;
    let count = 0;
    
    marks.forEach(mark => {
        totalScore += mark.score;
        count++;
    });
    
    const average = count > 0 ? Math.round(totalScore / count) : 0;
    averageScoreEl.textContent = `${average}%`;
    
    // Find top performer
    const studentScores = {};
    
    marks.forEach(mark => {
        if (!studentScores[mark.studentId]) {
            studentScores[mark.studentId] = { total: 0, count: 0 };
        }
        studentScores[mark.studentId].total += mark.score;
        studentScores[mark.studentId].count++;
    });
    
    let topPerformer = null;
    let highestAvg = 0;
    
    for (const studentId in studentScores) {
        if (studentScores[studentId].count === 0) continue;
        
        const avg = studentScores[studentId].total / studentScores[studentId].count;
        if (avg > highestAvg) {
            highestAvg = avg;
            const student = students.find(s => s.id === studentId);
            if (student) {
                topPerformer = `${student.name} (${Math.round(avg)}%)`;
            }
        }
    }
    
    topPerformerEl.textContent = topPerformer || '-';
    
    // Update performance chart
    updatePerformanceChart();
}

function updatePerformanceChart() {
    const chartCanvas = document.getElementById('performance-chart');
    if (!chartCanvas) {
        console.error("Performance chart canvas not found");
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context from canvas");
        return;
    }
    
    // Group marks by subject
    const subjectData = {};
    marks.forEach(mark => {
        if (!subjectData[mark.subject]) {
            subjectData[mark.subject] = { total: 0, count: 0 };
        }
        subjectData[mark.subject].total += mark.score;
        subjectData[mark.subject].count++;
    });
    
    const subjects = Object.keys(subjectData);
    const averages = subjects.map(subject => 
        Math.round(subjectData[subject].total / subjectData[subject].count)
    );
    
    // Check if Chart is defined
    if (typeof Chart === 'undefined') {
        console.error("Chart.js is not loaded");
        return;
    }
    
    // Destroy previous chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    try {
        window.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Score',
                    data: averages,
                    backgroundColor: 'rgba(78, 115, 223, 0.8)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error creating performance chart:", error);
    }
}

function updateProgressChart(type) {
    const chartCanvas = document.getElementById('progress-chart');
    if (!chartCanvas) {
        console.error("Progress chart canvas not found");
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context from canvas");
        return;
    }
    
    const progressStudent = document.getElementById('progress-student');
    if (!progressStudent) {
        console.error("Progress student select not found");
        return;
    }
    
    const selectedStudentId = progressStudent.value;
    
    // Check if Chart is defined
    if (typeof Chart === 'undefined') {
        console.error("Chart.js is not loaded");
        return;
    }
    
    // Destroy previous chart if it exists
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    try {
        if (type === 'subject') {
            // Subject performance chart
            let filteredMarks = marks;
            if (selectedStudentId) {
                filteredMarks = marks.filter(m => m.studentId === selectedStudentId);
            }
            
            const subjectData = {};
            filteredMarks.forEach(mark => {
                if (!subjectData[mark.subject]) {
                    subjectData[mark.subject] = { total: 0, count: 0 };
                }
                subjectData[mark.subject].total += mark.score;
                subjectData[mark.subject].count++;
            });
            
            const subjects = Object.keys(subjectData);
            const averages = subjects.map(subject => 
                Math.round(subjectData[subject].total / subjectData[subject].count)
            );
            
            window.progressChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: subjects,
                    datasets: [{
                        label: 'Average Score',
                        data: averages,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        } else {
            // Term comparison chart
            let filteredMarks = marks;
            if (selectedStudentId) {
                filteredMarks = marks.filter(m => m.studentId === selectedStudentId);
            }
            
            const termData = {};
            filteredMarks.forEach(mark => {
                if (!termData[mark.term]) {
                    termData[mark.term] = { total: 0, count: 0 };
                }
                termData[mark.term].total += mark.score;
                termData[mark.term].count++;
            });
            
            const terms = Object.keys(termData).sort();
            const averages = terms.map(term => 
                Math.round(termData[term].total / termData[term].count)
            );
            
            window.progressChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: terms,
                    datasets: [{
                        label: 'Average Score',
                        data: averages,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error creating progress chart:", error);
    }
}

function generateReport() {
    try {
        const studentId = document.getElementById('report-student').value;
        const term = document.getElementById('report-term').value;
        
        if (!studentId || !term) {
            alert('Please select both student and term');
            return;
        }
        
        if (!students || !marks) {
            alert('Student or marks data not available');
            return;
        }
        
        const student = students.find(s => s.id === studentId);
        const studentMarks = marks.filter(m => m.studentId === studentId && m.term === term);
        
        if (!student || studentMarks.length === 0) {
            alert('No data available for this student and term');
            return;
        }
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert('PDF generation library not loaded');
            return;
        }
        
        const doc = new jsPDF();
        // School Header
        doc.setFontSize(22);
        doc.setTextColor(40, 53, 147);
        doc.setFont('helvetica', 'bold');
        doc.text('ABC SCHOOL', 105, 15, { align: 'center' });
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Academic Progress Report', 105, 25, { align: 'center' });

        // Draw a line below the header
        doc.setDrawColor(40, 53, 147);
        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);

        // Student Info Section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Student Information:', 20, 40);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${student.name}`, 20, 48);
        doc.text(`Class: ${student.class} - ${student.section}`, 20, 56);
        doc.text(`Roll No: ${student.rollNo}`, 20, 64);
        doc.text(`Term: ${term}`, 20, 72);

        // Draw a box around the student info
        doc.setDrawColor(200, 200, 200);
        doc.rect(18, 36, 174, 42);

        // Marks Table
        const headers = [['Subject', 'Marks Obtained', 'Maximum Marks', 'Grade']];
        const data = studentMarks.map(mark => [
            mark.subject,
            mark.score.toString(),
            '100',
            calculateGrade(mark.score)
        ]);

        // Add total row
        const total = studentMarks.reduce((sum, mark) => sum + mark.score, 0);
        const percentage = (total / (studentMarks.length * 100)) * 100;
        data.push(['TOTAL', total.toString(), `${studentMarks.length * 100}`, '']);

        // Check if autoTable plugin is available
        if (typeof doc.autoTable !== 'function') {
            alert('PDF table plugin not available');
            doc.text('Table generation failed - missing plugin', 20, 80);
        } else {
            doc.autoTable({
            startY: 90,
            head: headers,
            body: data,
            theme: 'striped',
            headStyles: {
                fillColor: [40, 53, 147],
                textColor: 255,
                fontSize: 12,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 11,
                textColor: 50
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 80, left: 20, right: 20 },
            styles: {
                cellPadding: 5
            }
            });

            // Summary Section
            const finalY = doc.lastAutoTable.finalY + 20;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Summary:', 20, finalY);
            doc.setFont('helvetica', 'normal');
            doc.text(`Percentage: ${percentage.toFixed(2)}%`, 20, finalY + 8);
            doc.text(`Overall Grade: ${calculateGrade(percentage)}`, 20, finalY + 16);

            // Footer Section
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Principal Signature', 140, finalY + 40);
            doc.text('Date: ___________', 140, finalY + 48);

            // Add a footer line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, finalY + 55, 190, finalY + 55);
        }

        // Save the PDF
        doc.save(`${student.name}_${term}_Report.pdf`);
        } catch (error) {
        console.error('Error generating report:', error);
        alert('Failed to generate report: ' + error.message);
        }
    }

    function calculateGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        if (score >= 40) return 'D';
        return 'F';
    }
