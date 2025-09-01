const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize database
db.initializeDatabase().catch(console.error);

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create user in database
        const userId = await db.createUser(username, email, passwordHash);
        
        res.json({ 
            success: true, 
            message: 'User registered successfully',
            userId: userId 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed' 
        });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Get user from database
        const user = await db.getUserByUsername(username);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.PASSWORD_HASH);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.ID,
                username: user.USERNAME,
                email: user.EMAIL
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
        });
    }
});

// Get all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await db.getAllMenuItems();
        res.json({ 
            success: true, 
            menuItems: menuItems 
        });
    } catch (error) {
        console.error('Error getting menu:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get menu' 
        });
    }
});

// Get menu items by category
app.get('/api/menu/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const menuItems = await db.getMenuItemsByCategory(category);
        res.json({ 
            success: true, 
            menuItems: menuItems 
        });
    } catch (error) {
        console.error('Error getting menu by category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get menu items' 
        });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        
        // Create order in database
        const orderId = await db.createOrder(userId, items, totalAmount);
        
        res.json({ 
            success: true, 
            message: 'Order created successfully',
            orderId: orderId 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create order' 
        });
    }
});

// Get user orders
app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await db.getUserOrders(userId);
        
        res.json({ 
            success: true, 
            orders: orders 
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get orders' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
