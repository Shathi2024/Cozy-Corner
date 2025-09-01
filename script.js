// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Here you would typically send the form data to a server
    // For now, we'll just log it to the console
    console.log('Form submitted:', { name, email, message });
    
    // Clear form
    contactForm.reset();
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
});

// Scroll-based animations
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    // Add background to navbar on scroll
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
});

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.getAttribute('id')) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Modal Handling
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const cartModal = document.getElementById('cartModal');
const signupLink = document.getElementById('signupLink');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Profile and logout elements
let profileDiv = document.getElementById('customerProfile');
let logoutBtn = document.getElementById('logoutBtn');
if (!profileDiv) {
    profileDiv = document.createElement('div');
    profileDiv.id = 'customerProfile';
    profileDiv.style.display = 'none';
    profileDiv.style.margin = '10px 0';
    profileDiv.style.padding = '10px';
    profileDiv.style.background = '#f3f3f3';
    profileDiv.style.borderRadius = '6px';
    profileDiv.style.textAlign = 'center';
    loginBtn.parentNode.insertBefore(profileDiv, loginBtn.nextSibling);
}
if (!logoutBtn) {
    logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.textContent = 'Log out';
    logoutBtn.style.display = 'none';
    logoutBtn.style.marginLeft = '10px';
    loginBtn.parentNode.insertBefore(logoutBtn, profileDiv.nextSibling);
}

// Show login modal
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// Switch to signup modal
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        cartModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === signupModal || e.target === cartModal) {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        cartModal.style.display = 'none';
    }
});

// Store users in localStorage for demo
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}
function findUser(email) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email);
}

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const profilePicInput = document.getElementById('profilePicInput');
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    if (findUser(email)) {
        alert('User already exists!');
        return;
    }
    let profilePic = '';
    if (profilePicInput && profilePicInput.files && profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e2) {
            profilePic = e2.target.result;
            saveUser({ name, email, password, profilePic });
            signupModal.style.display = 'none';
            signupForm.reset();
            alert('Account created successfully! Please log in.');
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        saveUser({ name, email, password, profilePic });
        signupModal.style.display = 'none';
        signupForm.reset();
        alert('Account created successfully! Please log in.');
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    const user = findUser(email);
    if (!user) {
        alert('Please sign up first');
        return;
    }
    if (user.password !== password) {
        alert('Incorrect password!');
        return;
    }
    loginModal.style.display = 'none';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loginBtn.textContent = 'Welcome!'; // এই লাইনটি যোগ করো
    // Show profile info (name, email, pic)
    let picHtml = user.profilePic
        ? `<div style='position:relative;display:inline-block;'>
                <img id='profilePicImg' src="${user.profilePic}" alt="Profile" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;object-fit:cover;cursor:pointer;" />
                <span id='changePhotoText' style='display:none;position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;font-size:12px;padding:2px 8px;border-radius:10px;'>Change photo</span>
           </div>`
        : `<div style='position:relative;display:inline-block;'>
                <img id='profilePicImg' src='' alt='Profile' style='width:60px;height:60px;border-radius:50%;margin-bottom:8px;object-fit:cover;display:none;cursor:pointer;' />
                <i class='fas fa-user-circle' style='font-size:60px;color:#bbb;margin-bottom:8px;cursor:pointer;'></i>
                <span id='changePhotoText' style='display:none;position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;font-size:12px;padding:2px 8px;border-radius:10px;'>Change photo</span>
           </div>`;
    profileDiv.innerHTML = `
        ${picHtml}<br>
        <strong>${user.name}</strong><br>
        <span style='color:#007bff'>${user.email}</span><br>
        <input type='file' id='profilePicUpload' accept='image/*' style='margin-top:10px;display:none;'>
        <button id='saveProfilePicBtn' style='margin-top:5px;display:none;'>Set Profile Picture</button>
    `;
    profileDiv.style.display = 'block';
    loginForm.reset();

    // Add event for profile pic click to show file input and 'Change photo'
    const profilePicImg = document.getElementById('profilePicImg');
    const changePhotoText = document.getElementById('changePhotoText');
    const fileInput = document.getElementById('profilePicUpload');
    const saveBtn = document.getElementById('saveProfilePicBtn');
    if (profilePicImg) {
        profilePicImg.addEventListener('mouseenter', () => {
            changePhotoText.style.display = 'block';
        });
        profilePicImg.addEventListener('mouseleave', () => {
            changePhotoText.style.display = 'none';
        });
        profilePicImg.addEventListener('click', () => {
            fileInput.style.display = 'inline-block';
            saveBtn.style.display = 'inline-block';
            changePhotoText.style.display = 'none';
        });
    }
    // If no photo, allow icon click too
    let icon = profileDiv.querySelector('i.fas.fa-user-circle');
    if (icon) {
        icon.addEventListener('mouseenter', () => {
            changePhotoText.style.display = 'block';
        });
        icon.addEventListener('mouseleave', () => {
            changePhotoText.style.display = 'none';
        });
        icon.addEventListener('click', () => {
            fileInput.style.display = 'inline-block';
            saveBtn.style.display = 'inline-block';
            changePhotoText.style.display = 'none';
        });
    }
    // Add event for profile pic upload (fix: always get latest user object before save)
    document.getElementById('saveProfilePicBtn').onclick = function() {
        const fileInput = document.getElementById('profilePicUpload');
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e2) {
                // Save new profile pic to user in localStorage
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const email = profileDiv.querySelector('span[style*="#007bff"]').textContent;
                let idx = users.findIndex(u => u.email === email);
                if (idx !== -1) {
                    users[idx].profilePic = e2.target.result;
                    localStorage.setItem('users', JSON.stringify(users));
                }
                // Update profile pic in UI
                const img = document.getElementById('profilePicImg');
                img.src = e2.target.result;
                img.style.display = 'inline-block';
                // Remove icon if present
                let icon = profileDiv.querySelector('i.fas.fa-user-circle');
                if (icon) icon.style.display = 'none';
                // Hide file input and button after setting
                fileInput.style.display = 'none';
                document.getElementById('saveProfilePicBtn').style.display = 'none';
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    };
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    profileDiv.style.display = 'none';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    loginBtn.textContent = 'Log In';
});

// Shopping Cart functionality
let cart = [];

// Handle quantity buttons
document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', () => {
        const container = button.closest('.order-controls');
        const quantityDisplay = container.querySelector('.quantity');
        let quantity = parseInt(quantityDisplay.textContent);
        
        if (button.classList.contains('plus')) {
            quantity++;
        } else if (button.classList.contains('minus') && quantity > 0) {
            quantity--;
        }
        
        quantityDisplay.textContent = quantity;
    });
});

// Update cart total
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('৳', ''));
        const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent);
        total += price * quantity;
    });
    
    document.getElementById('cartTotal').textContent = `৳${total}`;
}

// Add item to cart
function addToCart(title, price, quantity) {
    const cartItems = document.getElementById('cartItems');
    const existingItem = Array.from(cartItems.children).find(item => 
        item.querySelector('.cart-item-title').textContent === title
    );
    
    if (existingItem) {
        const quantityElem = existingItem.querySelector('.cart-item-quantity');
        const currentQuantity = parseInt(quantityElem.textContent);
        quantityElem.textContent = currentQuantity + quantity;
    } else {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="cart-item-title">${title}</span>
            <span class="cart-item-price">৳${price}</span>
            <span class="cart-item-quantity">${quantity}</span>
            <button class="remove-item">&times;</button>
        `;
        cartItems.appendChild(cartItem);
        
        // Add remove functionality
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            cartItem.remove();
            updateCartTotal();
        });
    }
    
    updateCartTotal();
}

// Event listener for Order Now buttons
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Check if user is logged in (loginBtn text is 'Welcome!')
        if (loginBtn.textContent !== 'Welcome!') {
            alert('Log in first please');
            return;
        }
        const menuItem = button.closest('.menu-item');
        const title = menuItem.querySelector('h3').textContent;
        const price = parseFloat(menuItem.querySelector('.price').textContent.replace('৳', ''));
        const quantity = parseInt(menuItem.querySelector('.quantity').textContent);
        if (quantity > 0) {
            addToCart(title, price, quantity);
            // Reset quantity
            menuItem.querySelector('.quantity').textContent = '0';
            // Show cart modal
            document.getElementById('cartModal').style.display = 'block';
        }
    });
});

// Menu Category Filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        // Show/hide menu items based on category
        menuItems.forEach(item => {
            if (category === item.dataset.category) {
                item.style.display = 'block';
                // Add fade-in animation
                item.style.animation = 'fadeIn 0.5s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});