import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

export const query = async (statement, data) => {
	const db = await mysql.createConnection({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
		// don't convert YYYY-MM-DD to YYYY-MM-DDT07:00:00.000Z
		dateStrings: true
	});

	let rows = [];
	let fields = [];

	if (Array.isArray(data)) {
		// prepared statement
		const sql = db.format(statement, data);
		console.log(sql);
		[rows, fields] = await db.execute(sql);

	} else {
		console.log(statement);
		[rows, fields] = await db.execute(statement);
	}

	await db.end();

	return rows.length === 1 ? rows[0] : rows;
}

