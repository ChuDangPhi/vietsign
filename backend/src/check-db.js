const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/besto/gitHub/vietsign/backend/.env' });

async function checkTopics() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [topics] = await connection.execute('SELECT * FROM topic LIMIT 10');
    console.log('Topics:', JSON.stringify(topics, null, 2));
    
    const [vocabs] = await connection.execute('SELECT * FROM vocabulary LIMIT 10');
    console.log('Vocabularies:', JSON.stringify(vocabs, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

checkTopics();
