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

const createUser = (username, password, role, accessToken) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Users (username, password, role, access_token) VALUES ('${username}', '${password}', '${role}', '${accessToken}')`;
        console.log(sql)
        database.appDatabase.exec(sql, (error, row) => {
            if (error) {
                reject(error.message);
            }
            const successMessage = "The user was entered successfully."
            resolve(successMessage);
        });
    });
};

// Get user
const getUser = (username) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Users WHERE username = '${username}'`;
        console.log(sql)
        database.appDatabase.get(sql, [], (error, row) => {
            if (error) {
                console.log("error")
                reject(error.message);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    getUsers,
    createUser,
    getUser,
  };