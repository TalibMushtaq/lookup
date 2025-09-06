// Configuration
const API_URL = window.location.origin + '/api';
let currentUser = null;
let currentUserType = null;

// Utility Functions
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'token': token // Keep both for compatibility
    };
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    setTimeout(() => {
        element.textContent = '';
    }, 5000);
}

// Auth Functions
function showLoginForm(type) {
    // Hide all forms first
    document.getElementById('userAuthForm').classList.add('hidden');
    document.getElementById('adminAuthForm').classList.add('hidden');
    document.getElementById('userAuthChoice').classList.add('hidden');
    document.getElementById('adminAuthChoice').classList.add('hidden');
    document.getElementById('heroSection').classList.add('hidden');
    
    // Show the choice form for the selected type
    document.getElementById(`${type}AuthChoice`).classList.remove('hidden');
}

function showAuthForm(type, action) {
    // Hide choice forms
    document.getElementById('userAuthChoice').classList.add('hidden');
    document.getElementById('adminAuthChoice').classList.add('hidden');

    const form = document.getElementById(`${type}AuthForm`);
    const title = document.getElementById(`${type}FormTitle`);
    const subtitle = document.getElementById(`${type}FormSubtitle`);
    const button = document.getElementById(`${type}AuthButton`);
    const nameGroup = document.getElementById('userNameGroup');

    if (action === 'signin') {
        title.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Sign In`;
        subtitle.textContent = `Access your ${type === 'user' ? 'learning journey' : 'dashboard'}`;
        button.textContent = 'Sign In';
        button.onclick = () => handleAuth(type, 'signin');
        if (type === 'user') {
            nameGroup.classList.add('hidden');
            document.getElementById('userName').required = false;
        }
    } else { // signup
        title.textContent = `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Account`;
        subtitle.textContent = 'Fill in the details below to get started.';
        button.textContent = 'Sign Up';
        button.onclick = () => handleAuth(type, 'signup');
        if (type === 'user') {
            nameGroup.classList.remove('hidden');
            document.getElementById('userName').required = true;
        }
    }

    form.classList.remove('hidden');
}

function hideAuthForms() {
    document.getElementById('userAuthForm').classList.add('hidden');
    document.getElementById('adminAuthForm').classList.add('hidden');
    document.getElementById('userAuthChoice').classList.add('hidden');
    document.getElementById('adminAuthChoice').classList.add('hidden');
    document.getElementById('heroSection').classList.remove('hidden');
    
    // Clear form fields
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
    
    // Clear error messages
    document.getElementById('userAuthError').textContent = '';
    document.getElementById('adminAuthError').textContent = '';
}

async function handleAuth(type, action) {
    if (type === 'user') {
        await handleUserAuth(action);
    } else {
        await handleAdminAuth(action);
    }
}

async function handleUserAuth(action) {
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value.trim();
    
    if (!email || !password || (action === 'signup' && !name)) {
        showError('userAuthError', 'Please fill in all required fields');
        return;
    }

    const body = { email, password };
    if (action === 'signup') {
        body.name = name;
    }

    try {
        const response = await fetch(`${API_URL}/user/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', 'user');
            currentUser = data;
            currentUserType = 'user';
            
            // Clear form
            document.getElementById('userEmail').value = '';
            document.getElementById('userPassword').value = '';
            
            updateUI();
            document.getElementById('userAuthForm').classList.add('hidden');
            
            showError('userAuthError', ''); // Clear any previous errors
        } else {
            showError('userAuthError', data.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('User auth error:', error);
        showError('userAuthError', 'Network error. Please try again.');
    }
}

async function handleAdminAuth(action) {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    if (!email || !password) {
        showError('adminAuthError', 'Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', 'admin');
            currentUser = data;
            currentUserType = 'admin';
            
            // Clear form
            document.getElementById('adminEmail').value = '';
            document.getElementById('adminPassword').value = '';
            
            updateUI();
            document.getElementById('adminAuthForm').classList.add('hidden');
            
            showError('adminAuthError', ''); // Clear any previous errors
        } else {
            showError('adminAuthError', data.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('Admin auth error:', error);
        showError('adminAuthError', 'Network error. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    currentUser = null;
    currentUserType = null;
    
    // Clear any forms
    hideAuthForms();
    
    updateUI();
}

// Course Functions
async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/course/preview`);
        const data = await response.json();

        if (response.ok) {
            displayCourses(data.courses || []);
        } else {
            console.error('Failed to load courses:', data.message);
            displayCourses([]);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        displayCourses([]);
    }
}

function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');
    
    if (courses.length === 0) {
        container.innerHTML = '<p class="no-courses">No courses available yet.</p>';
        return;
    }
    
    container.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-card';
        
        const imageUrl = course.imageUrl || 'https://via.placeholder.com/300x200?text=Course+Image';
        const title = course.title || 'Untitled Course';
        const description = course.description || 'No description available';
        const price = course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free';
        
        courseElement.innerHTML = `
            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x200?text=Course+Image'">
            <div class="course-card-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="course-card-footer">
                    <span class="course-price">${price}</span>
                    ${getActionButton(course)}
                </div>
            </div>
        `;
        container.appendChild(courseElement);
    });
}

function getActionButton(course) {
    if (currentUserType === 'user') {
        // Check if the user has already purchased this course
        const userCourses = JSON.parse(localStorage.getItem('userCourses')) || [];
        const isPurchased = userCourses.some(p_course => p_course._id === course._id);
        
        if (isPurchased) {
            return `<button class="btn-secondary" onclick="viewCourse('${course._id}')" disabled>Purchased</button>`;
        }
        return `<button class="btn-primary" onclick="purchaseCourse('${course._id}')">Purchase</button>`;
    } else if (currentUserType === 'admin') {
        return `<button class="btn-outline" onclick="editCourse('${course._id}')">Edit</button>`;
    } else {
        return `<button class="btn-primary" onclick="showLoginForm('user')">Purchase</button>`;
    }
}

async function createCourse() {
    const title = document.getElementById('courseTitle').value.trim();
    const description = document.getElementById('courseDescription').value.trim();
    const imageUrl = document.getElementById('courseImage').value.trim();
    const price = document.getElementById('coursePrice').value;
    
    if (!title || !description) {
        showError('courseCreateError', 'Please fill in title and description');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/course`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                title, 
                description, 
                imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Course+Image',
                price: price ? parseFloat(price) : 0
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Clear form
            document.getElementById('courseTitle').value = '';
            document.getElementById('courseDescription').value = '';
            document.getElementById('courseImage').value = '';
            document.getElementById('coursePrice').value = '';
            
            showError('courseCreateError', ''); // Clear errors
            loadCourses(); // Reload courses
            
            // Show success message briefly
            const successMsg = document.createElement('p');
            successMsg.textContent = 'Course created successfully!';
            successMsg.style.color = 'var(--success-color)';
            successMsg.style.fontSize = '0.875rem';
            successMsg.style.marginTop = '0.5rem';
            
            const createButton = document.querySelector('#adminPanel button');
            createButton.parentNode.insertBefore(successMsg, createButton.nextSibling);
            
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.parentNode.removeChild(successMsg);
                }
            }, 3000);
        } else {
            showError('courseCreateError', data.message || 'Failed to create course');
        }
    } catch (error) {
        console.error('Course creation error:', error);
        showError('courseCreateError', 'Network error. Please try again.');
    }
}

async function purchaseCourse(courseId) {
    if (!courseId) {
        alert('Invalid course ID');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/course/purchase/${courseId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            alert('Course purchased successfully!');
            loadUserCourses(); // Refresh user's course list
            loadCourses(); // Refresh public courses to update button state
        } else {
            alert(data.message || 'Failed to purchase course');
        }
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Network error. Please try again.');
    }
}

async function editCourse(courseId) {
    // For now, just alert - you can implement edit functionality later
    alert(`Edit course functionality would be implemented for course ID: ${courseId}`);
    // TODO: Implement course editing modal/form
}

// UI Update Functions
function updateUI() {
    const logoutBtn = document.getElementById('logoutBtn');
    const adminPanel = document.getElementById('adminPanel');
    const userDashboard = document.getElementById('userDashboard');
    const heroSection = document.getElementById('heroSection');
    const authButtons = document.querySelectorAll('.auth-buttons .btn-secondary:not(#logoutBtn)');

    if (currentUser && currentUserType) {
        // Show logout button
        logoutBtn.classList.remove('hidden');
        
        // Hide login buttons
        authButtons.forEach(btn => {
            if (btn.id !== 'logoutBtn') {
                btn.classList.add('hidden');
            }
        });
        
        // Hide hero section when logged in
        heroSection.classList.add('hidden');
        
        // Show appropriate dashboard
        if (currentUserType === 'admin') {
            adminPanel.classList.remove('hidden');
            userDashboard.classList.add('hidden');
        } else {
            adminPanel.classList.add('hidden');
            userDashboard.classList.remove('hidden');
            loadUserCourses(); // Load user's purchased courses
        }
    } else {
        // Show login buttons
        logoutBtn.classList.add('hidden');
        authButtons.forEach(btn => {
            btn.classList.remove('hidden');
        });
        
        // Show hero section when not logged in
        heroSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        userDashboard.classList.add('hidden');
    }

    // Always reload courses to update action buttons
    loadCourses();
}

// Load user's purchased courses
async function loadUserCourses() {
    if (currentUserType !== 'user') return;
    
    try {
        const response = await fetch(`${API_URL}/user/courses`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const purchasedCourses = data.courses || [];
            localStorage.setItem('userCourses', JSON.stringify(purchasedCourses)); // Cache user courses
            displayUserCourses(purchasedCourses);
        }
    } catch (error) {
        console.error('Error loading user courses:', error);
    }
}

function displayUserCourses(courses) {
    const container = document.getElementById('userCoursesContainer');
    
    if (courses.length === 0) {
        container.innerHTML = '<p class="no-courses">You haven\'t purchased any courses yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-card user-course';
        
        courseElement.innerHTML = `
            <img src="${course.imageUrl}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Course+Image'">
            <div class="course-card-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button class="btn-primary" onclick="viewCourse('${course._id}')">View Course</button>
            </div>
        `;
        container.appendChild(courseElement);
    });
}

// View course content (placeholder)
async function viewCourse(courseId) {
    alert(`View course functionality would be implemented for course ID: ${courseId}`);
    // TODO: Implement course viewing modal/page
}

// Placeholder functions for footer links
function showAbout() {
    alert('About page - Coming soon!');
}

function showContact() {
    alert('Contact page - Coming soon!');
}

function showPrivacy() {
    alert('Privacy Policy - Coming soon!');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
        currentUser = { token };
        currentUserType = userType;
    }
    
    // Initial UI update and course load
    updateUI();
    
    // Add enter key support for forms
    document.getElementById('userPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserAuth('signin');
        }
    });
    
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAdminAuth('signin');
        }
    });
});

// Make functions globally available
window.showLoginForm = showLoginForm;
window.showAuthForm = showAuthForm;
window.hideAuthForms = hideAuthForms;
window.handleAuth = handleAuth;
window.handleUserAuth = handleUserAuth;
window.handleAdminAuth = handleAdminAuth;
window.logout = logout;
window.createCourse = createCourse;
window.purchaseCourse = purchaseCourse;
window.editCourse = editCourse;
window.viewCourse = viewCourse;
window.showAbout = showAbout;
window.showContact = showContact;
window.showPrivacy = showPrivacy;
window.closeCourseModal = closeCourseModal;