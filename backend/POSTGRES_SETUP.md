# PostgreSQL Setup

The backend uses PostgreSQL instead of MongoDB.

## 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Or use Docker:**
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=syllatech --name syllatech-db postgres:16
```

## 2. Create the database

If not using Docker with POSTGRES_DB:
```bash
createdb syllatech
```

## 3. Configure connection

In `backend/.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/syllatech"
```

Examples:
- Default local (no password): `postgresql://localhost:5432/syllatech`
- With user/password: `postgresql://postgres:postgres@localhost:5432/syllatech`

## 4. Install Python deps (in venv)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

## 5. Run the backend

Tables are created automatically on startup.
```bash
uvicorn server:app --reload
```
