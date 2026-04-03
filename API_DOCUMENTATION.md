# API Documentation

Base URL: `http://localhost:4000`

## Authentication
Use Bearer token in protected routes:

`Authorization: Bearer <token>`

Login endpoint returns token.

---

## 1) Health

### GET `/health`

Response `200`
```json
{
  "success": true,
  "message": "Service is healthy",
  "timestamp": "2026-04-03T15:42:10.123Z"
}
```

---

## 2) Auth

### POST `/api/auth/login`

Body
```json
{
  "email": "admin@finance.local",
  "password": "Admin@123"
}
```

Response `200`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
      "name": "System Admin",
      "email": "admin@finance.local",
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
}
```

Invalid credentials response `401`
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Inactive user response `403`
```json
{
  "success": false,
  "message": "User account is inactive"
}
```

---

## 3) Users API

## GET `/api/users/me`
Protected: any authenticated user

Response `200`
```json
{
  "success": true,
  "data": {
    "id": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
    "name": "System Admin",
    "email": "admin@finance.local",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-04-03T09:10:00.000Z",
    "updatedAt": "2026-04-03T09:10:00.000Z"
  }
}
```

### GET `/api/users`
Protected: `ADMIN`

Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
      "name": "System Admin",
      "email": "admin@finance.local",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2026-04-03T09:10:00.000Z",
      "updatedAt": "2026-04-03T09:10:00.000Z"
    }
  ]
}
```

### POST `/api/users`
Protected: `ADMIN`

Body
```json
{
  "name": "Finance Viewer",
  "email": "viewer2@finance.local",
  "password": "Viewer123",
  "role": "VIEWER",
  "status": "ACTIVE"
}
```

Response `201`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "4f6d58f4-c312-4db0-ae42-f7ae5a4d7a7d",
    "name": "Finance Viewer",
    "email": "viewer2@finance.local",
    "role": "VIEWER",
    "status": "ACTIVE",
    "createdAt": "2026-04-03T11:25:00.000Z",
    "updatedAt": "2026-04-03T11:25:00.000Z"
  }
}
```

Duplicate email response `409`
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### GET `/api/users/:id`
Protected: `ADMIN`

Response `200`
```json
{
  "success": true,
  "data": {
    "id": "4f6d58f4-c312-4db0-ae42-f7ae5a4d7a7d",
    "name": "Finance Viewer",
    "email": "viewer2@finance.local",
    "role": "VIEWER",
    "status": "ACTIVE",
    "createdAt": "2026-04-03T11:25:00.000Z",
    "updatedAt": "2026-04-03T11:25:00.000Z"
  }
}
```

Not found response `404`
```json
{
  "success": false,
  "message": "User not found"
}
```

### PATCH `/api/users/:id`
Protected: `ADMIN`

Body
```json
{
  "status": "INACTIVE"
}
```

Response `200`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "4f6d58f4-c312-4db0-ae42-f7ae5a4d7a7d",
    "name": "Finance Viewer",
    "email": "viewer2@finance.local",
    "role": "VIEWER",
    "status": "INACTIVE",
    "createdAt": "2026-04-03T11:25:00.000Z",
    "updatedAt": "2026-04-03T11:31:00.000Z"
  }
}
```

---

## 4) Financial Records API

### GET `/api/records?page=1&limit=10`
Protected: `ANALYST`, `ADMIN`

Optional query params:
- `type`: `INCOME` or `EXPENSE`
- `category`
- `startDate` (ISO datetime)
- `endDate` (ISO datetime)
- `sortBy`: `recordDate | amount | createdAt`
- `sortOrder`: `asc | desc`

Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "f6fbf389-4f1b-4c2b-905a-6cdbb1595224",
      "amount": 12000,
      "type": "EXPENSE",
      "category": "Rent",
      "recordDate": "2026-04-03T00:00:00.000Z",
      "notes": "Apartment rent",
      "createdById": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
      "createdAt": "2026-04-03T09:40:00.000Z",
      "updatedAt": "2026-04-03T09:40:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### GET `/api/records/:id`
Protected: `ANALYST`, `ADMIN`

Response `200`
```json
{
  "success": true,
  "data": {
    "id": "f6fbf389-4f1b-4c2b-905a-6cdbb1595224",
    "amount": 12000,
    "type": "EXPENSE",
    "category": "Rent",
    "recordDate": "2026-04-03T00:00:00.000Z",
    "notes": "Apartment rent",
    "createdById": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
    "createdAt": "2026-04-03T09:40:00.000Z",
    "updatedAt": "2026-04-03T09:40:00.000Z"
  }
}
```

Not found response `404`
```json
{
  "success": false,
  "message": "Record not found"
}
```

### POST `/api/records`
Protected: `ADMIN`

Body
```json
{
  "amount": 2500,
  "type": "EXPENSE",
  "category": "Transport",
  "recordDate": "2026-04-03T00:00:00.000Z",
  "notes": "Cab fare"
}
```

Response `201`
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": "17b63ce7-fa02-4c69-9ab5-bf093de3f4b2",
    "amount": 2500,
    "type": "EXPENSE",
    "category": "Transport",
    "recordDate": "2026-04-03T00:00:00.000Z",
    "notes": "Cab fare",
    "createdById": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
    "createdAt": "2026-04-03T12:14:00.000Z",
    "updatedAt": "2026-04-03T12:14:00.000Z"
  }
}
```

### PATCH `/api/records/:id`
Protected: `ADMIN`

Body
```json
{
  "amount": 2800,
  "notes": "Cab + parking"
}
```

Response `200`
```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "id": "17b63ce7-fa02-4c69-9ab5-bf093de3f4b2",
    "amount": 2800,
    "type": "EXPENSE",
    "category": "Transport",
    "recordDate": "2026-04-03T00:00:00.000Z",
    "notes": "Cab + parking",
    "createdById": "6cffe059-aaf2-4b93-8c1a-030e87a9c827",
    "createdAt": "2026-04-03T12:14:00.000Z",
    "updatedAt": "2026-04-03T12:18:00.000Z"
  }
}
```

### DELETE `/api/records/:id`
Protected: `ADMIN`

Response `200`
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

---

## 5) Dashboard API

### GET `/api/dashboard/summary?months=6&recentLimit=5`
Protected: `VIEWER`, `ANALYST`, `ADMIN`

Response `200`
```json
{
  "success": true,
  "data": {
    "totals": {
      "income": 135000,
      "expenses": 19500,
      "netBalance": 115500
    },
    "categoryTotals": [
      {
        "category": "Freelance",
        "type": "INCOME",
        "total": 15000
      },
      {
        "category": "Rent",
        "type": "EXPENSE",
        "total": 12000
      }
    ],
    "recentActivity": [
      {
        "id": "f6fbf389-4f1b-4c2b-905a-6cdbb1595224",
        "type": "EXPENSE",
        "amount": 12000,
        "category": "Rent",
        "recordDate": "2026-04-03T00:00:00.000Z",
        "notes": "Apartment rent"
      }
    ],
    "monthlyTrend": [
      {
        "month": "2026-03",
        "income": 15000,
        "expense": 4500,
        "net": 10500
      },
      {
        "month": "2026-04",
        "income": 120000,
        "expense": 15000,
        "net": 105000
      }
    ]
  }
}
```

---

## Standard Error Responses

### 401 Unauthorized (missing/invalid token)
```json
{
  "success": false,
  "message": "Missing or invalid authorization token"
}
```

### 401 Unauthorized (expired token)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden (role blocked)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### 400 Validation failed (example invalid UUID param)
For example: `GET /api/records/976331aa-dd79-4b9e-a6a7-b082ba2259da`
```json
{
  "success": false,
  "message": "Validation failed",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "id": [
        "Invalid UUID"
      ]
    }
  }
}
```

### 404 Route not found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500 Internal server error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Postman Quick Flow
1. Login via `/api/auth/login` and copy token.
2. Use token in Authorization tab as Bearer token.
3. Test in order:
   - `/api/users/me`
   - `/api/records?page=1&limit=10`
   - `/api/dashboard/summary`
   - create/update/delete record as admin.

