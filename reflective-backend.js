// reflective-backend (dig) - a dynamic MySQL REST interface

import express from "express";
import cors from "cors";
import mysql from "mysql2";
import url from "url";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// WARNING: Use environment variables or config files for production
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "YOUR_PASSWORD", // NEVER hardcode passwords
  database: process.env.DB_NAME || "YOUR_DB_NAME"
});

db.connect(err => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Utility: Retrieve primary key column from DESCRIBE
function getPrimaryKey(fields) {
  const pkField = fields.find(f => f.Key === "PRI");
  return pkField ? pkField.Field : null;
}

// Dynamic GET endpoint with optional WHERE, ORDER BY, LIMIT
app.get("/api/:table", async (req, res) => {
  const table = req.params.table;
  let { limit, where, orderby } = req.query;

  // Handle non-encoded dirty URLs
  const rawUrl = url.parse(req.originalUrl).query || "";
  if (!where) {
    const match = rawUrl.match(/where ([^&]+)/i);
    if (match) {
      where = decodeURIComponent(match[1].trim());
      console.log("[!] Parsed WHERE from dirty URL:", where);
    }
  }

  const describeQuery = `DESCRIBE \`${table}\``;

  db.query(describeQuery, (err, fields) => {
    if (err) {
      console.error("DESCRIBE failed:", err);
      return res.status(500).json({ error: "DESCRIBE failed" });
    }

    const columns = fields.map(col => `\`${col.Field}\``).join(", ");
    let sql = `SELECT ${columns} FROM \`${table}\``;

    if (where) sql += ` WHERE ${where}`;
    if (orderby) sql += ` ORDER BY ${orderby}`;
    if (limit) sql += ` LIMIT ${limit}`;

    console.log("Generated SQL:", sql);

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Query failed:", err);
        return res.status(500).json({ error: "Query failed" });
      }
      res.json(result);
    });
  });
});

// CREATE: Insert new row into table
app.post("/api/:table", (req, res) => {
  const table = req.params.table;
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No data provided" });
  }

  const columns = Object.keys(data).map(k => `\`${k}\``).join(", ");
  const values = Object.values(data);
  const placeholders = values.map(() => "?").join(", ");

  const insertQuery = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("INSERT failed:", err);
      return res.status(500).json({ error: "INSERT failed" });
    }
    res.json({ insertedId: result.insertId });
  });
});

// UPDATE: Update row based on dynamic primary key
app.put("/api/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No update data provided" });
  }

  const describeQuery = `DESCRIBE \`${table}\``;
  db.query(describeQuery, (err, fields) => {
    if (err) {
      console.error("DESCRIBE failed:", err);
      return res.status(500).json({ error: "DESCRIBE failed" });
    }

    const primaryKey = getPrimaryKey(fields);
    if (!primaryKey) {
      return res.status(400).json({ error: "Primary key not found" });
    }

    const assignments = Object.keys(data).map(k => `\`${k}\` = ?`).join(", ");
    const values = Object.values(data);
    const updateQuery = `UPDATE \`${table}\` SET ${assignments} WHERE \`${primaryKey}\` = ?`;

    db.query(updateQuery, [...values, id], (err, result) => {
      if (err) {
        console.error("UPDATE failed:", err);
        return res.status(500).json({ error: "UPDATE failed" });
      }
      res.json({ affectedRows: result.affectedRows });
    });
  });
});

// DELETE: Remove row using dynamic primary key
app.delete("/api/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;

  const describeQuery = `DESCRIBE \`${table}\``;
  db.query(describeQuery, (err, fields) => {
    if (err) {
      console.error("DESCRIBE failed:", err);
      return res.status(500).json({ error: "DESCRIBE failed" });
    }

    const primaryKey = getPrimaryKey(fields);
    if (!primaryKey) {
      return res.status(400).json({ error: "Primary key not found" });
    }

    const deleteQuery = `DELETE FROM \`${table}\` WHERE \`${primaryKey}\` = ?`;
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("DELETE failed:", err);
        return res.status(500).json({ error: "DELETE failed" });
      }
      res.json({ affectedRows: result.affectedRows });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Reflective Backend running at http://localhost:${PORT}`);
});
