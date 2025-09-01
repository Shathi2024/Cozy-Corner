// Oracle Database Configuration and Operations
const oracledb = require('oracledb');

// Database connection configuration
const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    connectString: 'localhost:1521/XE', // Default Oracle connection string
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// Initialize Oracle client
async function initializeOracle() {
    try {
        await oracledb.initOracleClient();
        console.log('Oracle client initialized successfully');
    } catch (err) {
        console.error('Error initializing Oracle client:', err);
    }
}

// Create database connection pool
async function createPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Database pool created successfully');
    } catch (err) {
        console.error('Error creating database pool:', err);
    }
}

// Get connection from pool
async function getConnection() {
    try {
        const connection = await oracledb.getConnection();
        return connection;
    } catch (err) {
        console.error('Error getting database connection:', err);
        throw err;
    }
}

// Close connection
async function closeConnection(connection) {
    try {
        if (connection) {
            await connection.close();
        }
    } catch (err) {
        console.error('Error closing connection:', err);
    }
}

// Create tables if they don't exist
async function createTables() {
    let connection;
    try {
        connection = await getConnection();
        
        // Users table
        await connection.execute(`
            CREATE TABLE users (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username VARCHAR2(50) UNIQUE NOT NULL,
                email VARCHAR2(100) UNIQUE NOT NULL,
                password_hash VARCHAR2(255) NOT NULL,
                created_date DATE DEFAULT SYSDATE
            )
        `);
        
        // Menu items table
        await connection.execute(`
            CREATE TABLE menu_items (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR2(100) NOT NULL,
                description VARCHAR2(500),
                price NUMBER(10,2) NOT NULL,
                category VARCHAR2(50) NOT NULL,
                image_url VARCHAR2(500),
                available BOOLEAN DEFAULT TRUE
            )
        `);
        
        // Orders table
        await connection.execute(`
            CREATE TABLE orders (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                user_id NUMBER REFERENCES users(id),
                order_date DATE DEFAULT SYSDATE,
                total_amount NUMBER(10,2) NOT NULL,
                status VARCHAR2(20) DEFAULT 'PENDING'
            )
        `);
        
        // Order items table
        await connection.execute(`
            CREATE TABLE order_items (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                order_id NUMBER REFERENCES orders(id),
                menu_item_id NUMBER REFERENCES menu_items(id),
                quantity NUMBER NOT NULL,
                price NUMBER(10,2) NOT NULL
            )
        `);
        
        await connection.commit();
        console.log('Tables created successfully');
        
    } catch (err) {
        console.error('Error creating tables:', err);
        if (connection) {
            await connection.rollback();
        }
    } finally {
        await closeConnection(connection);
    }
}

// Insert sample menu data
async function insertSampleData() {
    let connection;
    try {
        connection = await getConnection();
        
        const menuItems = [
            // Hot Coffee
            ['Cappuccino', 'Rich espresso with steamed milk foam', 495, 'hot-coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'],
            ['Cafe Latte', 'Smooth espresso with steamed milk', 440, 'hot-coffee', 'https://images.unsplash.com/photo-1511920170033-f8396924c348'],
            ['Espresso', 'Pure, intense coffee experience', 330, 'hot-coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'],
            ['Americano', 'Espresso diluted with hot water', 385, 'hot-coffee', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'],
            ['Mocha', 'Espresso with chocolate and steamed milk', 522, 'hot-coffee', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d'],
            ['Macchiato', 'Espresso with a dollop of steamed milk', 385, 'hot-coffee', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'],
            ['Flat White', 'Espresso with velvety microfoam', 467, 'hot-coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'],
            ['Turkish Coffee', 'Traditional unfiltered coffee with cardamom', 440, 'hot-coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'],
            
            // Cold Coffee
            ['Iced Latte', 'Chilled espresso with cold milk and ice', 495, 'cold-coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'],
            ['Frappuccino', 'Blended coffee with ice cream and whipped cream', 605, 'cold-coffee', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e'],
            ['Cold Brew', 'Smooth, slow-steeped cold coffee', 467, 'cold-coffee', 'https://images.unsplash.com/photo-1594261956806-3ad03785c9b4'],
            ['Iced Americano', 'Espresso over ice with cold water', 385, 'cold-coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'],
            ['Iced Mocha', 'Chilled mocha with whipped cream', 550, 'cold-coffee', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e'],
            ['Nitro Cold Brew', 'Cold brew infused with nitrogen for creamy texture', 605, 'cold-coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'],
            
            // Pastries & Desserts
            ['Butter Croissant', 'Flaky, buttery French pastry', 357, 'pastries', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812'],
            ['Chocolate Muffin', 'Rich chocolate chip muffin', 385, 'pastries', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2'],
            ['New York Cheesecake', 'Classic creamy cheesecake', 522, 'pastries', 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6'],
            ['Pain au Chocolat', 'Flaky croissant with dark chocolate', 440, 'pastries', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812'],
            ['Tiramisu', 'Italian coffee-flavored dessert', 605, 'pastries', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2'],
            ['Chocolate Eclair', 'Choux pastry filled with cream and chocolate', 467, 'pastries', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812'],
            
            // Sandwiches & Wraps
            ['Grilled Chicken Sandwich', 'Grilled chicken breast with lettuce, tomato, and mayo', 605, 'sandwiches', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Veggie Wrap', 'Fresh vegetables with hummus in whole wheat tortilla', 467, 'sandwiches', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Tuna Salad Sandwich', 'Fresh tuna with celery and light mayo on whole grain bread', 550, 'sandwiches', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            
            // Breakfast Items
            ['Avocado Toast', 'Sourdough bread with smashed avocado and poached eggs', 605, 'breakfast', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Oatmeal Bowl', 'Steel-cut oats with berries, nuts, and honey', 440, 'breakfast', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Eggs Benedict', 'Poached eggs on English muffin with hollandaise sauce', 715, 'breakfast', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            
            // Other Beverages
            ['Hot Chocolate', 'Rich Belgian chocolate with whipped cream', 467, 'beverages', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Chai Latte', 'Spiced Indian tea with steamed milk', 385, 'beverages', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Green Tea', 'Premium Japanese sencha green tea', 275, 'beverages', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c'],
            ['Fresh Orange Juice', 'Freshly squeezed orange juice', 330, 'beverages', 'https://images.unsplash.com/photo-1504674900240-9c9c0c0c0c0c']
        ];
        
        for (const item of menuItems) {
            await connection.execute(`
                INSERT INTO menu_items (name, description, price, category, image_url)
                VALUES (:1, :2, :3, :4, :5)
            `, item);
        }
        
        await connection.commit();
        console.log('Sample data inserted successfully');
        
    } catch (err) {
        console.error('Error inserting sample data:', err);
        if (connection) {
            await connection.rollback();
        }
    } finally {
        await closeConnection(connection);
    }
}

// User operations
async function createUser(username, email, passwordHash) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            INSERT INTO users (username, email, password_hash)
            VALUES (:1, :2, :3)
            RETURNING id INTO :4
        `, [username, email, passwordHash, { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }]);
        
        await connection.commit();
        return result.outBinds.id[0];
    } catch (err) {
        console.error('Error creating user:', err);
        if (connection) {
            await connection.rollback();
        }
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

async function getUserByUsername(username) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            SELECT id, username, email, password_hash, created_date
            FROM users
            WHERE username = :1
        `, [username]);
        
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user:', err);
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

// Menu operations
async function getAllMenuItems() {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            SELECT id, name, description, price, category, image_url, available
            FROM menu_items
            WHERE available = TRUE
            ORDER BY category, name
        `);
        
        return result.rows;
    } catch (err) {
        console.error('Error getting menu items:', err);
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

async function getMenuItemsByCategory(category) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            SELECT id, name, description, price, category, image_url, available
            FROM menu_items
            WHERE category = :1 AND available = TRUE
            ORDER BY name
        `, [category]);
        
        return result.rows;
    } catch (err) {
        console.error('Error getting menu items by category:', err);
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

// Order operations
async function createOrder(userId, items, totalAmount) {
    let connection;
    try {
        connection = await getConnection();
        
        // Create order
        const orderResult = await connection.execute(`
            INSERT INTO orders (user_id, total_amount)
            VALUES (:1, :2)
            RETURNING id INTO :3
        `, [userId, totalAmount, { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }]);
        
        const orderId = orderResult.outBinds.id[0];
        
        // Create order items
        for (const item of items) {
            await connection.execute(`
                INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                VALUES (:1, :2, :3, :4)
            `, [orderId, item.menuItemId, item.quantity, item.price]);
        }
        
        await connection.commit();
        return orderId;
    } catch (err) {
        console.error('Error creating order:', err);
        if (connection) {
            await connection.rollback();
        }
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

async function getUserOrders(userId) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            SELECT o.id, o.order_date, o.total_amount, o.status,
                   oi.quantity, oi.price,
                   mi.name as item_name
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.user_id = :1
            ORDER BY o.order_date DESC
        `, [userId]);
        
        return result.rows;
    } catch (err) {
        console.error('Error getting user orders:', err);
        throw err;
    } finally {
        await closeConnection(connection);
    }
}

// Initialize database
async function initializeDatabase() {
    try {
        await initializeOracle();
        await createPool();
        await createTables();
        await insertSampleData();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// Export functions
module.exports = {
    initializeDatabase,
    createUser,
    getUserByUsername,
    getAllMenuItems,
    getMenuItemsByCategory,
    createOrder,
    getUserOrders,
    getConnection,
    closeConnection
};
