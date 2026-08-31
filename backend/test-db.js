require("dotenv").config();

const db = require("./db");

async function testDatabase() {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    console.log("✅ MySQL connection successful!");
    console.log(rows);

    process.exit(0);
  } catch (error) {
    console.error("❌ MySQL connection failed!");
    console.error(error.message);

    process.exit(1);
  }
}

testDatabase();