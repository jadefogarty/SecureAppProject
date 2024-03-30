const database = require('../database/database');
const logger = require('../logger');

// Get users
const getUsers = (callback) => {
    const sql = `SELECT * FROM Users`;
    database.appDatabase.all(sql, [], (error, rows) => {
      if (error) {
        logger.error('Error getting Users data:', error);
        console.error(error.message);
      }
      logger.info('Users data got from User table');
      callback(rows);
    });
  };

// Create new user
const createUser = (username, password, role, accessToken, callback) => {
    const sql = `INSERT INTO Users (username, password, role, access_token) VALUES ('${username}', '${password}', '${role}', '${accessToken}')`;
    console.log(sql)
    database.appDatabase.run(sql, [], (error, row) => {
        if (error) {
            logger.error('Error creating new User:', error);
            return callback(error.message);
        }
        logger.info('New User created in table.');
        const successMessage = "The user was entered successfully"
        callback(successMessage);
    });
};

// Get user
const getUser = (username) => {
    return new Promise((resolve, reject) => {
        console.log(username);
        const sql = `SELECT * FROM Users WHERE username = ?`;
        database.appDatabase.get(sql, [username], (error, row) => {
            if (error) {
                logger.error('Error getting User data:', error);
                reject(error.message);
            } else {
                logger.info('User data got from User table');
                //console.log(row);
                resolve(row);
            }
        });
    });
};


// Update user  
const getAndUpdateUserToken = (username, accessToken, callback) => {
    let sql = `UPDATE Users SET access_token = '${accessToken}' WHERE username = '${username}'`;
    database.appDatabase.run(sql, [], (error, row) => {
        if (error) {
            callback(error.message);
        }
        logger.info('User data updated in User table');
        const successMessage = "The user was successfully updated."
        callback(successMessage);
        //console.log("The user was succesfully updated")
        return
    });
};

module.exports = {
    getUsers,
    createUser,
    getUser,
    getAndUpdateUserToken
  };