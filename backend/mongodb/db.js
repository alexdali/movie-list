require('dotenv').config({ path: 'variables.env' });

const password = process.env.DBUSER_PASS;

const mongoDBurl = process.env.MONGODB_URL;

const uri = `mongodb+srv://dbprog:${password}@${mongoDBurl}`;

export default uri;
