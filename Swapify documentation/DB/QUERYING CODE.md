-- יצירת ENUM עבור סטטוסים
CREATE TYPE request_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE notification_status AS ENUM ('Unread', 'Read');
CREATE TYPE user_report_status AS ENUM ('Open', 'Under Review', 'Closed');
CREATE TYPE exchange_status AS ENUM ('Completed', 'Pending', 'Rejected');
CREATE TYPE subcategory_puzzle AS ENUM ('Nature', 'Art', 'Kids', '3 D');
CREATE TYPE subcategory_book AS ENUM ('Romance', 'Thriller', 'Fantasy', 'Sci-Fi', 'Children', 'Non-fiction', 'Biography', 'Textbook');
CREATE TYPE subcategory_board_game AS ENUM ('Strategy', 'Kids', 'Party', 'Puzzle', 'Two-player', 'Group');
CREATE TYPE role_names AS ENUM ('Admin', 'Guest', 'User');



CREATE TABLE IF NOT EXISTS Roles (
    Role_id SERIAL PRIMARY KEY,      -- מזהה ייחודי לכל תפקיד
    Role_name role_names NOT NULL   -- שם התפקיד, לדוג' "User", "Admin"
);

INSERT INTO Roles (role_name)
VALUES ('Guest'), ('User'), ('Admin');

CREATE TABLE IF NOT EXISTS Users (
    User_id SERIAL PRIMARY KEY,                 -- מזהה ייחודי למשתמש
    Name VARCHAR (100) NOT NULL,                  -- שם המשתמש
    Email VARCHAR (255) NOT NULL UNIQUE,          -- כתובת הדוא"ל של המשתמש
    Password_hash VARCHAR (255) NOT NULL,         -- סיסמת המשתמש (בצורת גיבוב)
    Profile_picture VARCHAR (255),                -- URL לתמונת פרופיל
    Location VARCHAR (100),                       -- מקום מגוריו של המשתמש
    Auth_provider VARCHAR (100),                  -- מקור ההתחברות (לדוג' Facebook, Google)
    Role_id INT NOT NULL,                        -- מזהה תפקיד המשתמש
    Notification_enabled BOOLEAN DEFAULT TRUE,   -- האם המשתמש רוצה לקבל התראות
    Is_banned BOOLEAN DEFAULT FALSE,            -- האם המשתמש חסום
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- תאריך יצירת המשתמש
    Updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- תאריך עדכון אחרון של המשתמש
    CONSTRAINT fk_role
        FOREIGN KEY (role_id) REFERENCES Roles (role_id) ON DELETE RESTRICT  -- קשר עם טבלת Roles
);

CREATE TABLE IF NOT EXISTS Products (
    Product_id SERIAL PRIMARY KEY,
    User_id INT REFERENCES Users (user_id),
    Title VARCHAR (255) NOT NULL,
    Description TEXT NOT NULL,
    Category VARCHAR (50) NOT NULL,
    Subcategory VARCHAR (255),
    Condition VARCHAR (50) CHECK (condition IN ('New', 'Used', 'Good Condition')),
    Location VARCHAR (255),
    Image_url VARCHAR (255),
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- יצירת טבלת Puzzles (מתחברת לטבלת Products)
CREATE TABLE IF NOT EXISTS Puzzles (
    Product_id INT PRIMARY KEY REFERENCES Products (product_id),
    Manufacturer VARCHAR (255),
    Pieces_count INT,
    Image_url VARCHAR (255),
    Subcategory subcategory_puzzle
);

-- יצירת טבלת Books (מתחברת לטבלת Products)
CREATE TABLE IF NOT EXISTS Books (
    Product_id INT PRIMARY KEY REFERENCES Products (product_id),
    Author VARCHAR (255),
    Publish_year INT,
    Publisher VARCHAR (255),
    Page_count INT,
    Image_url VARCHAR (255),
    Subcategory subcategory_book
);

-- יצירת טבלת Board_Games (מתחברת לטבלת Products)
CREATE TABLE IF NOT EXISTS Board_Games (
    Product_id INT PRIMARY KEY REFERENCES Products (product_id),
    Game_name VARCHAR (255),
    Min_players INT,
    Max_players INT,
    Duration INT,
    Image_url VARCHAR (255),
    Subcategory subcategory_board_game
);

-- יצירת טבלת Exchange_Requests
CREATE TABLE IF NOT EXISTS Exchange_Requests (
    Request_id SERIAL PRIMARY KEY,
    User_id INT REFERENCES Users (user_id),
    Product_id INT REFERENCES Products (product_id),
    Exchange_product_id INT REFERENCES Products (product_id),
    Status request_status,
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Chat_id INT
);

-- יצירת טבלת Product_Information_Requests
CREATE TABLE IF NOT EXISTS Product_Information_Requests (
    Request_id SERIAL PRIMARY KEY,
    User_id INT REFERENCES Users (user_id),
    Product_id INT REFERENCES Products (product_id),
    Message TEXT,
    Status request_status,
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- יצירת טבלת Notifications
CREATE TABLE IF NOT EXISTS Notifications (
    Notification_id SERIAL PRIMARY KEY,
    User_id INT REFERENCES Users (user_id),
    Message TEXT,
    Status notification_status,
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- יצירת טבלת Chats
CREATE TABLE IF NOT EXISTS Chats (
    Chat_id SERIAL PRIMARY KEY,
    Exchange_request_id INT REFERENCES Exchange_Requests (request_id),
    User_id_1 INT REFERENCES Users (user_id),
    User_id_2 INT REFERENCES Users (user_id),
    Messages TEXT,
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- יצירת טבלת User_Reports
CREATE TABLE IF NOT EXISTS User_Reports (
    Report_id SERIAL PRIMARY KEY,
    Reported_user_id INT REFERENCES Users (user_id),
    User_id INT REFERENCES Users (user_id),
    Report_reason TEXT,
    Status user_report_status,
    Created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- יצירת טבלת Exchange_History
CREATE TABLE IF NOT EXISTS Exchange_History (
    Exchange_id SERIAL PRIMARY KEY,
    User_id INT REFERENCES Users (user_id),
    Exchange_product_id INT REFERENCES Products (product_id),
    Received_product_id INT REFERENCES Products (product_id),
    Exchange_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Rating_given INT CHECK (rating_given BETWEEN 1 AND 5),
    Rating_received INT CHECK (rating_received BETWEEN 1 AND 5),
    Status exchange_status
);

-- יצירת טבלת Audit_Logs (של פעולות כלליות במערכת)
CREATE TABLE IF NOT EXISTS Audit_Logs (
    Log_id SERIAL PRIMARY KEY,
    Action VARCHAR (255),
    User_id INT REFERENCES Users (user_id),
    Timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    Details TEXT
);
