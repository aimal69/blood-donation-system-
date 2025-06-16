const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blood_bank_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        const [rows] = await connection.execute('SELECT 1 as test');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

async function getMany(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return { success: true, data: rows };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getOne(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return { success: true, data: rows[0] || null };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function insert(query, params = []) {
    try {
        const [result] = await pool.execute(query, params);
        return { success: true, insertId: result.insertId, affectedRows: result.affectedRows };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function update(query, params = []) {
    try {
        const [result] = await pool.execute(query, params);
        return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function remove(query, params = []) {
    try {
        const [result] = await pool.execute(query, params);
        return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

testConnection();

module.exports = { getOne, getMany, insert, update, remove };
