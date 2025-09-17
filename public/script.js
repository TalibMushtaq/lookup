document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app-root');
    const navLinks = document.getElementById('nav-links');
    const homeLink = document.getElementById('home-link');
    const coursesLink = document.getElementById('courses-link');
    const userLoginLink = document.getElementById('user-login-link');
    const instructorAuthLink = document.getElementById('instructor-auth-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');
    const hamburgerMenu = document.getElementById('hamburger-menu');

    const API_URL = '/api';

    // --- STATE MANAGEMENT ---
    // Use localStorage for token persistence
    const setToken = (token) => { localStorage.setItem('token', token); };
    const getToken = () => localStorage.getItem('token');
    const removeToken = () => { localStorage.removeItem('token'); };

    const updateNav = () => {
        const token = getToken();
        if (token) {
            userLoginLink.classList.add('hidden');
            instructorAuthLink.classList.add('hidden');
            signupLink.classList.add('hidden');
            logoutLink.classList.remove('hidden');
        } else {
            userLoginLink.classList.remove('hidden');
            instructorAuthLink.classList.remove('hidden');
            signupLink.classList.remove('hidden');
            logoutLink.classList.add('hidden');
        }
    };

    // --- UTILITY FUNCTIONS ---
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // --- RENDER FUNCTIONS ---
    const renderHome = () => {
        app.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-slides">
                    <div class="carousel-slide">
                        <img src="https://img-c.udemycdn.com/notices/home_carousel_slide/image/7180f379-6e05-4f9d-a276-e9c0ac82078b.png" alt="Poster 1">
                        <div class="slide-content">
                            <h3>WEB DEVELOPMENT</h3>
                            <p>Learn from the best instructors in the industry.</p>
                        </div>
                    </div>
                    <div class="carousel-slide">
                        <img src="https://plus.unsplash.com/premium_photo-1661758351472-52ed02e99496?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGRhdGElMjBzY2llbmNlfGVufDB8fDB8fHww" alt="Poster 2">
                        <div class="slide-content">
                            <h3>DATA SCIENCE</h3>
                            <p>Unlock insights from your data with expert guidance.</p>
                        </div>
                    </div>
                    <div class="carousel-slide">
                        <img src="https://plus.unsplash.com/premium_photo-1682124710157-d1573373a4f5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D" alt="Poster 3">
                        <div class="slide-content">
                            <h3>MACHINE LEARNING</h3>
                            <p>Build intelligent applications with cutting-edge AI.</p>
                        </div>
                    </div>
                </div>
                <button class="carousel-btn carousel-prev">&#10094;</button>
                <button class="carousel-btn carousel-next">&#10095;</button>
            </div>
            <div class="hero-section">
                <h1>Welcome to Lookup</h1>
                <p>Discover your next course and accelerate your career</p>
                <a href="#" class="cta-button" id="explore-courses">Explore All Courses</a>
            </div>
        `;
        
        document.getElementById('explore-courses').addEventListener('click', (e) => {
            e.preventDefault();
            renderCourses();
        });

        // Carousel Logic
        const slides = document.querySelector('.carousel-slides');
        if (slides) { // Check if carousel exists before adding logic
            const slideCount = document.querySelectorAll('.carousel-slide').length;
            const prevBtn = document.querySelector('.carousel-prev');
            const nextBtn = document.querySelector('.carousel-next');
            let currentIndex = 0;

            const showSlide = (index) => {
                slides.style.transform = `translateX(-${index * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slideCount;
                showSlide(currentIndex);
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                showSlide(currentIndex);
            });

            // Auto-play functionality
            setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                showSlide(currentIndex);
            }, 5000); // Change slide every 5 seconds
        }
    };

    const renderCourses = async () => {
        app.innerHTML = `
            <div class="courses-header">
                <h2>All Courses</h2>
                <p>Choose from our comprehensive selection of courses</p>
            </div>
            <div style="text-align: center; margin: 2rem auto;">
                <div class="loading"></div>
            </div>
        `;
        
        try {
            const response = await fetch(`${API_URL}/course/all`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');

            const coursesContainer = document.createElement('div');
            coursesContainer.id = 'courses-container';
            
            data.courses.forEach((course, index) => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.style.animationDelay = `${index * 0.1}s`;
                courseCard.innerHTML = `
                    <img src="${course.imageUrl}" alt="${course.title}">
                    <div class="course-card-content">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                    </div>
                `;
                coursesContainer.appendChild(courseCard);
            });
            
            app.innerHTML = `
                <div class="courses-header">
                    <h2>All Courses</h2>
                    <p>Choose from our comprehensive selection of courses</p>
                </div>
            `;
            app.appendChild(coursesContainer);
        } catch (error) {
            app.innerHTML += `<p style="color: #ff6b6b; text-align: center; margin-top: 2rem;">Error loading courses: ${error.message}</p>`;
        }
    };

    const renderUserLogin = () => {
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-image-container">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=60" alt="Students learning">
                </div>
                <div class="form-container">
                    <h2>Start Your Learning Journey</h2>
                    <p class="form-subtitle">Login with us to get your programming journey started.</p>
                    <form id="user-login-form">
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('user-login-form').addEventListener('submit', handleUserLogin);
    };

    const renderInstructorLogin = () => {
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-image-container">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=60" alt="Instructor teaching">
                </div>
                <div class="form-container">
                    <h2>Inspire The Next Generation</h2>
                    <p class="form-subtitle">Login to manage your courses and students.</p>
                    <form id="instructor-login-form">
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('instructor-login-form').addEventListener('submit', handleInstructorLogin);
    };

    const renderSignup = () => {
        app.innerHTML = `
            <div class="auth-container signup-page">
                <div class="auth-image-container">
                    <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x2.webp" alt="Person signing up">
                </div>
                <div class="form-container">
                    <h2>Join Lookup Today</h2>
                    <p class="form-subtitle">Create an account to save your progress and access courses.</p>
                    <form id="signup-form">
                        <input type="text" name="firstName" placeholder="First Name" required>
                        <input type="text" name="lastName" placeholder="Last Name" required>
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
    };

    const renderInstructorAuth = () => {
        app.innerHTML = `
            <div class="auth-choice-container">
                <h2>For Instructors</h2>
                <p>Share your knowledge with the world. Join our community of instructors.</p>
                <div class="auth-choice-buttons">
                    <button class="choice-btn login-btn" id="instructor-choice-login">Login</button>
                    <button class="choice-btn signup-btn" id="instructor-choice-signup">Sign Up</button>
                </div>
            </div>
        `;
        document.getElementById('instructor-choice-login').addEventListener('click', renderInstructorLogin);
        document.getElementById('instructor-choice-signup').addEventListener('click', renderInstructorSignup);
    };

    const renderInstructorSignup = () => {
        app.innerHTML = `
            <div class="auth-container signup-page">
                 <div class="auth-image-container">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=60" alt="Instructor teaching">
                </div>
                <div class="form-container">
                    <h2>Become an Instructor</h2>
                    <p class="form-subtitle">Create an account to start teaching today.</p>
                    <form id="instructor-signup-form">
                        <input type="text" name="firstName" placeholder="First Name" required>
                        <input type="text" name="lastName" placeholder="Last Name" required>
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Sign Up as Instructor</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('instructor-signup-form').addEventListener('submit', handleInstructorSignup);
    };

    const renderInstructorDashboard = () => {
        app.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h1>Instructor Dashboard</h1>
                    <p>Here you can manage your courses and track student progress.</p>
                </div>

                <form class="create-course-form" id="create-course-form">
                    <h2>Create a New Course</h2>
                    <div class="form-group">
                        <label for="course-title">Course Title</label>
                        <input type="text" id="course-title" name="title" placeholder="e.g., Introduction to Web Development" required>
                    </div>
                    <div class="form-group">
                        <label for="course-description">Course Description</label>
                        <textarea id="course-description" name="description" placeholder="Describe what your course is about..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="course-price">Price ($)</label>
                        <input type="number" id="course-price" name="price" placeholder="e.g., 99.99" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="course-image">Thumbnail Image URL</label>
                        <input type="url" id="course-image" name="imageUrl" placeholder="https://example.com/image.png" required>
                    </div>
                     <div class="form-group">
                        <label for="course-video">Video Link (optional)</label>
                        <input type="url" id="course-video" name="videoUrl" placeholder="https://youtube.com/watch?v=...">
                    </div>
                    <button type="submit">Create Course</button>
                </form>
            </div>
        `;
        document.getElementById('create-course-form').addEventListener('submit', handleCreateCourse);
    };

    // --- EVENT HANDLERS ---
    const handleUserLogin = async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/user/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Login failed');
            
            setToken(result.token);
            updateNav();
            renderCourses();
            showNotification('Login successful!', 'success');
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    const handleInstructorLogin = async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/instructor/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Login failed');
            
            setToken(result.token);
            updateNav();
            renderInstructorDashboard();
            showNotification('Welcome back, Instructor!', 'success');
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/user/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Signup failed');
            
            showNotification(result.message, 'success');
            renderUserLogin();
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    const handleInstructorSignup = async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/instructor/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Signup failed');
            
            showNotification(result.message, 'success');
            renderInstructorLogin(); // Go to login page after successful signup
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const token = getToken();

        try {
            const response = await fetch(`${API_URL}/course/create`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to create course');

            showNotification('Course created successfully!', 'success');
            e.target.reset(); // Clear the form
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    const handleLogout = () => {
        removeToken();
        updateNav();
        renderHome();
        showNotification('Logged out successfully', 'success');
    };

    // --- ROUTING & INITIALIZATION ---
    const closeMobileMenu = () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    };

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderHome();
        closeMobileMenu();
    });
    coursesLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCourses();
        closeMobileMenu();
    });
    userLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderUserLogin();
        closeMobileMenu();
    });
    instructorAuthLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderInstructorAuth();
        closeMobileMenu();
    });
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderSignup();
        closeMobileMenu();
    });
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
        closeMobileMenu();
    });

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Initial load
    updateNav();
    renderHome();
});