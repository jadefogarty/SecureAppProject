const database = require('../database/database');

// Get users
const getUsers = (callback) => {
    const sql = `SELECT * FROM Users`;
    database.appDatabase.all(sql, [], (error, rows) => {
      if (error) {
        console.error(error.message);
      }
      callback(rows);
    });
  };

// Create new user
const createUser = (username, password, role, accessToken, callback) => {
    const sql = `INSERT INTO Users (username, password, role, access_token) VALUES ('${username}', '${password}', '${role}', '${accessToken}')`;
    database.appDatabase.run(sql, [], (error, row) => {
        if (error) {
            callback(error.message);
        }
        const successMessage = "The user was entered successfully."
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
                reject(error.message);
            } else {
                console.log(row);
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