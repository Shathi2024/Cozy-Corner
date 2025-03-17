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

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    // Here you would typically send the login data to a server
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, we'll just close the modal and update the login button
    loginModal.style.display = 'none';
    loginBtn.textContent = 'Welcome!';
    loginForm.reset();
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Here you would typically send the signup data to a server
    console.log('Signup data:', userData);
    
    // For demo purposes, we'll just close the modal
    signupModal.style.display = 'none';
    signupForm.reset();
    alert('Account created successfully! Please log in.');
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