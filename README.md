# Reflective Backend

**Reflective Backend** is a zero-config, dynamic REST backend for any MySQL-compatible database. It lets you interact with your data instantly via standard HTTP requests, using real-time schema introspection.

**Developed with support from OpenAI's GPT-4, guided by a reevy mindset.**

**This package is released for non-commercial use only. For commercial use, please contact the author.**

## 🚀 Features

- ⚡ Auto-generates endpoints for all tables
- 🔍 Reflects schema using `DESCRIBE` – no hardcoded logic
- 🔁 Supports full CRUD:
  - `GET /api/:table` (with `where`, `orderby`, `limit`)
  - `POST /api/:table`
  - `PUT /api/:table/:id`
  - `DELETE /api/:table/:id`
- 🧠 Handles “dirty URLs” (non-standard query formats)
- 🔐 Configurable via environment variables



## 📦 Installation

```bash
npm install reflective-backend
