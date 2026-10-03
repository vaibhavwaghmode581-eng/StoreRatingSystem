require("dotenv").config();

const bcrypt = require("bcryptjs");
const { Client } = require("pg");

async function resetPassword() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const newPassword = "Rahul@456";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await client.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, "rahul@test.com"]
    );

    console.log("UPDATED ROWS:", result.rowCount);
    console.log("Rahul password reset successfully.");

  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    await client.end();
  }
}

resetPassword();