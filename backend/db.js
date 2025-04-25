const oracledb = require('oracledb');
oracledb.fetchAsString = [ oracledb.CLOB ];  // Add this line

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

        // For SELECT queries, result.rows exists.
        // For DML statements (INSERT, UPDATE, DELETE), result.rows might be undefined.
        if (result.rows) {
          // Convert result.rows into plain values (if needed)
          return result.rows.map(row =>
            row.map(cell => (cell && typeof cell === 'object' && 'val' in cell ? cell.val : cell))
          );
        } else {
          return result;
        }
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
