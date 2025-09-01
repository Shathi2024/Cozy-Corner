# Cozy Corner Coffee Shop - Oracle Database Integration

This is a coffee shop website with Oracle database integration for user management, menu items, and order processing.

## Features

- **User Management**: Registration and login with secure password hashing
- **Menu System**: Dynamic menu with categories (Hot Coffee, Cold Coffee, Pastries & Desserts, Sandwiches & Wraps, Breakfast Items, Other Beverages)
- **Order Processing**: Complete order management system
- **Database**: Oracle database with connection pooling
- **API**: RESTful API endpoints for all operations

## Prerequisites

1. **Oracle Database** (XE, Standard, or Enterprise Edition)
2. **Node.js** (version 14 or higher)
3. **Oracle Instant Client** (for your operating system)

## Installation

1. **Clone or download the project files**

2. **Install Oracle Instant Client**
   - Download from [Oracle's website](https://www.oracle.com/database/technologies/instant-client/downloads.html)
   - Extract to a directory (e.g., `C:\oracle\instantclient_21_12` on Windows)
   - Add the directory to your system PATH

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Configure database connection**
   - Edit `database.js` file
   - Update the `dbConfig` object with your Oracle credentials:
   ```javascript
   const dbConfig = {
       user: 'your_username',
       password: 'your_password',
       connectString: 'localhost:1521/XE', // or your connection string
       poolMin: 10,
       poolMax: 10,
       poolIncrement: 0
   };
   ```

5. **Create database tables**
   ```bash
   npm run init-db
   ```

## Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`

## Database Schema

### Tables Created

1. **users**
   - id (NUMBER, Primary Key)
   - username (VARCHAR2(50), Unique)
   - email (VARCHAR2(100), Unique)
   - password_hash (VARCHAR2(255))
   - created_date (DATE)

2. **menu_items**
   - id (NUMBER, Primary Key)
   - name (VARCHAR2(100))
   - description (VARCHAR2(500))
   - price (NUMBER(10,2))
   - category (VARCHAR2(50))
   - image_url (VARCHAR2(500))
   - available (BOOLEAN)

3. **orders**
   - id (NUMBER, Primary Key)
   - user_id (NUMBER, Foreign Key to users)
   - order_date (DATE)
   - total_amount (NUMBER(10,2))
   - status (VARCHAR2(20))

4. **order_items**
   - id (NUMBER, Primary Key)
   - order_id (NUMBER, Foreign Key to orders)
   - menu_item_id (NUMBER, Foreign Key to menu_items)
   - quantity (NUMBER)
   - price (NUMBER(10,2))

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:category` - Get menu items by category

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:userId` - Get user orders

## File Structure

```
cozy-corner-coffee-shop/
├── index.html          # Main website HTML
├── styles.css          # Website styling
├── script.js           # Frontend JavaScript
├── database.js         # Oracle database operations
├── server.js           # Node.js server
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Troubleshooting

### Common Issues

1. **Oracle Client Error**
   - Ensure Oracle Instant Client is installed and in PATH
   - Check if the client version matches your Oracle database version

2. **Connection Error**
   - Verify database credentials in `database.js`
   - Check if Oracle database service is running
   - Ensure firewall allows connections on port 1521

3. **Table Creation Error**
   - Ensure your Oracle user has CREATE TABLE privileges
   - Check if tables already exist (they won't be recreated)

### Error Logs

Check the console output for detailed error messages. The application logs all database operations and errors.

## Security Features

- Password hashing using bcrypt
- SQL injection prevention with parameterized queries
- CORS configuration for API security
- Input validation and sanitization

## Development

For development, the application includes:
- Hot reloading with nodemon
- Detailed error logging
- CORS enabled for frontend development
- Environment-based configuration

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify Oracle database connectivity
3. Ensure all dependencies are installed
4. Check file permissions and paths

## License

MIT License - See package.json for details
