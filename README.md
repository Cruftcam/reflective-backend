# Reflective Backend

**Reflective Backend** is a zero-config, dynamic REST backend for any MySQL-compatible database. It lets you interact with your data instantly via standard HTTP requests, using real-time schema introspection.

> #### Developed with support from [OpenAI's GPT-4][GPT-4], guided by a reevy mindset.


## Features

- Auto-generates endpoints for all tables
- Reflects schema using `DESCRIBE` – no hardcoded logic
- Supports full CRUD:
  - `GET /api/:table` (with `where`, `orderby`, `limit`)
  - `POST /api/:table`
  - `PUT /api/:table/:id`
  - `DELETE /api/:table/:id`
- Handles “dirty URLs” (non-standard query formats)
- Configurable via environment variables


## Getting Started

### 1. Install

```bash
npm install reflective-backend
```

Or clone manually:
```bash
git clone https://github.com/Cruftcam/reflective-backend.git
cd reflective-backend
npm install
```
### 2. Configure your database connection
You can either edit directly in reflective-backend.js or use environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

### 3. Run the server
```bash
node reflective-backend.js
```

The server will start at: http://localhost:5000

## Example API Usage (with fetch)

> You can use any table name from your MySQL database in the :table placeholder.

### 🔹 GET all records from a table

```sh
fetch("http://localhost:5000/api/film")
  .then(res => res.json())
  .then(console.log);
```
### 🔹 GET with WHERE + LIMIT

```sh
fetch("http://localhost:5000/api/film?where=rating='PG'&limit=5")
  .then(res => res.json())
  .then(console.log);
```

### 🔹 POST new record

```sh
fetch("http://localhost:5000/api/category", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Example Category",
    last_update: new Date().toISOString()
  })
});
```

### 🔹 PUT update a record
```sh
fetch("http://localhost:5000/api/category/2", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Updated Category" })
});
```

### 🔹 DELETE a record
```sh
fetch("http://localhost:5000/api/category/2", {
  method: "DELETE"
});
```

## Notes
- Automatically determines the table’s primary key for updates and deletions.

- Designed for internal development use — use with care in production.

- Great for dashboards, editors, internal tools, or scaffolding apps

- Built with `Express`, `MySQL2`, `CORS`

## License
####  [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)][cc-license]
This software is free to use for non-commercial projects.
You must give credit to the original author.
For commercial use, please [contact the author][woco].

## Credits

This tool was developed using OpenAI's GPT-based assistant and published with appreciation for all contributors behind open source libraries like `express`, `cors` and `mysql2`.

## Author
Developed with ❤️ & 🍺 in Bavaria by Stefan aka [crufty][woco] from **Cruftcam.com**

## ❤️ Contributions
Contributions, issues and feedback welcome.
If you improve it, fork it and send a pull request!

[//]: # (reference links) 

[woco]: <https://github.com/Cruftcam/reflective-backend>
[cc-license]: <https://creativecommons.org/licenses/by-nc/4.0/>
[GPT-4]: <https://openai.com/chatgpt>