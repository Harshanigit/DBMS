import poolObj from './dbPool.js';
const { pool } = poolObj;

let logonUsers = new Map();

const sendQuery = async (sql, doCommit, ...params) => {
    let conn, result
    try {
        conn = await pool.getConnection()
        result = await conn.query(sql, params)
        if (doCommit) {
            await conn.query('COMMIT')
        }
    } catch (err) {
		result = err
        throw err
    } finally {
        if (conn)
            conn.release()
        return(result)
    }
}

const findOneUser = async (username) => sendQuery(`SELECT * FROM users WHERE username = ?`, false, username);

const getAllData = async () => 
    sendQuery(`SELECT * FROM data`);

const getDataById = async (id) =>
    sendQuery(`SELECT * FROM data WHERE data.id = ?`, false, id);

const getAllUsers = async () => 
    sendQuery(`SELECT * FROM users`);

const addOneUser = async (username, password) => 
    sendQuery( `INSERT INTO users (username, password) VALUES (?, ?)`, false, username, password);

const addData = ({id, Firstname, Surname, userid}) =>
    sendQuery(`INSERT INTO data (id, Firstname, Surname, userid) VALUES (?, ?, ?, ?)`, true, id, Firstname, Surname, userid);

// Function to call the GenerateRows stored procedure
const addRandomUsers = async (maxUsers) => {
    const query = 'CALL addRandomUsers(?)'; // Call the stored procedure with the maxUsers parameter
    return sendQuery(query, false, maxUsers);
};


/*
const getUserByName = (username) => 
    sendQuery(`SELECT * FROM users WHERE username = ?`, false, username);

const deleteData = (id, userid) =>
    sendQuery(`DELETE FROM data WHERE id = ? AND userid = ?`, true, id, userid);
*/
export {
    
    addOneUser,
    getAllUsers,
    findOneUser,
    getAllData,
    getDataById,
    addData,
    logonUsers,
    addRandomUsers //
//    getUserByName,
//    deleteData,
}


