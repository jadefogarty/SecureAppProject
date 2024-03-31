# Install Project Dependencies
1. Open a command line terminal window
2. Navigate to the projects directory using the `cd` command in the terminal window
3. Run the `npm install` command

--------

# Run the project
The following steps can be used to run the project

1. Open a second command line terminal window in the terminal window
2. Navigate to the projects directory using the `cd` command
5. Run the `npm start` to start the production server

Verify the application is running by navigating to the server address in
the preferred browser.
http://localhost:4567


--------


# References / Guides used for this project's secure branch
1. Initial database connection and setup with MVC architecture 
    https://devsday.ru/blog/details/65389
2. Role Based Access Control and JWT 
    https://soshace.com/implementing-role-based-access-control-in-a-node-js-application/


# Initial data entries for Database
CREATE TABLE Reviews(
book_title TEXT NOT NULL,
book_author TEXT NOT NULL,
rating INT NOT NULL,
comments TEXT NOT NULL,
review_id INTEGER PRIMARY KEY AUTOINCREMENT);
INSERT INTO Reviews (book_title, book_author, rating, comments, review_id)
VALUES ('Little Women', 'Louisa May Alcott', '9', 'Great book with well-written characters', '1'),
('The Great Gatsby', 'F. Scott Fitzgerald', '8', 'Good story set in the 1920s', '2'),
('The Picture of Dorian Gray', 'Oscar Wilde', '8', 'Good story with an interesting character', '3');

CREATE TABLE Users (
username TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
role TEXT NOT NULL,
access_token TEXT,
user_id INTEGER PRIMARY KEY AUTOINCREMENT);
INSERT INTO Users (username, password, role, user_id, access_token)
VALUES ('admin', 'password', 'admin', '1', ''), ('test1', 'pass', 'user', '2', '');