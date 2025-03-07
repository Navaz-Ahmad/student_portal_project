// backend/db.js
const oracledb = require('oracledb');

const dbConfig = {
    user: 'ahmad',      
    password: 'dbms',  
    connectString: 'localhost:1521/XE'
};

async function executeQuery(query, binds = [], options = { autoCommit: true }) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query, binds, options);
        return result.rows;
    } catch (err) {
        console.error('Database Error:', err);
        return null;
    } finally {
        if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error('Error closing connection:', err);
            }
        }
    }
}

module.exports = { executeQuery };
