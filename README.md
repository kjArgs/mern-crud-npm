# kj-mern-crud

A lightweight, TypeScript-based CRUD helper library for Express and Mongoose applications. It helps you generate reusable create, read, update, and delete route handlers with less boilerplate and built-in validation support for write operations.

[![npm version](https://img.shields.io/npm/v/kj-mern-crud.svg)](https://www.npmjs.com/package/kj-mern-crud)
[![License](https://img.shields.io/npm/l/kj-mern-crud.svg)](https://www.npmjs.com/package/kj-mern-crud)

## Purpose

`kj-mern-crud` is built to simplify repetitive controller logic in Node.js and MERN-style projects. Instead of rewriting nearly identical CRUD handlers for every model, you can reuse the same handler factories across your Express routes.

This package is useful when you want:

- less controller boilerplate
- reusable CRUD logic across models
- request validation for create and update actions
- simple query-based filtering for reads
- a cleaner TypeScript-friendly Express setup

## Features

- Lightweight CRUD handler factories for Express and Mongoose
- TypeScript support with generated declaration files
- Validation support for create and update operations
- Query parameter filtering for read operations
- Simple integration with existing Mongoose models
- Consistent JSON response structure

## Installation

Install via npm:

```bash
npm install kj-mern-crud
```

Or with yarn:

```bash
yarn add kj-mern-crud
```

## Quick Start

```typescript
import express from "express";
import mongoose from "mongoose";
import { addData, getData, updateData, deleteData } from "kj-mern-crud";
import type { ValidationSchema } from "kristan1-input-validator";

const app = express();
app.use(express.json());

const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  age: Number,
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

const validationSchema: ValidationSchema = {
  firstName: { required: true, minLength: 2 },
  email: { required: true, minLength: 5 },
  age: { required: true },
};

app.post("/users", addData(User, validationSchema));
app.get("/users", getData(User));
app.put("/users/:id", updateData(User, validationSchema));
app.delete("/users/:id", deleteData(User));
```

## API Documentation

### `addData(model, validationSchema)`

Creates an Express handler that validates incoming data and stores a new document.

**Parameters:**

- `model` (`Model<T>`): The Mongoose model to create data in
- `validationSchema` (`ValidationSchema`): Validation rules from `kristan1-input-validator`

**Expected request body:**

```json
{
  "data": {
    "firstName": "Kristan",
    "email": "kristan@example.com",
    "age": 24
  }
}
```

**Behavior:**

- validates `req.body.data`
- converts numbers and booleans to strings before validation
- creates a new MongoDB document with the original `data`
- returns a success response when creation succeeds

### `getData(model)`

Creates an Express handler that fetches documents using request query parameters.

**Parameters:**

- `model` (`Model<T>`): The Mongoose model to query

**Example request:**

```http
GET /users?firstName=juan&age=24&isActive=true
```

**Behavior:**

- numeric query values are converted to `Number`
- `true` and `false` are converted to booleans
- other string values are matched using a case-insensitive regex

### `updateData(model, validationSchema)`

Creates an Express handler that validates and updates a document by ID.

**Parameters:**

- `model` (`Model<T>`): The Mongoose model to update
- `validationSchema` (`ValidationSchema`): Validation rules from `kristan1-input-validator`

**Expected route parameter:**

- `req.params.id`

**Expected request body:**

```json
{
  "data": {
    "firstName": "Updated Name",
    "age": 30
  }
}
```

### `deleteData(model)`

Creates an Express handler that deletes a document by ID.

**Parameters:**

- `model` (`Model<T>`): The Mongoose model to delete from

**Expected route parameter:**

- `req.params.id`

## Validation Notes

This package uses `kristan1-input-validator` for validation in `addData` and `updateData`.

Example schema:

```typescript
import type { ValidationSchema } from "kristan1-input-validator";

const userValidationSchema: ValidationSchema = {
  firstName: { required: true, minLength: 2 },
  email: { required: true, minLength: 5 },
  age: { required: true },
};
```

## Usage Examples

### Example 1: Create a User

```typescript
app.post("/users", addData(User, validationSchema));
```

Request body:

```json
{
  "data": {
    "firstName": "Kristan",
    "email": "kristan@example.com",
    "age": 24,
    "isActive": true
  }
}
```

### Example 2: Get Users with Filters

```typescript
app.get("/users", getData(User));
```

Example request:

```http
GET /users?firstName=kris&isActive=true
```

### Example 3: Update a User

```typescript
app.put("/users/:id", updateData(User, validationSchema));
```

### Example 4: Delete a User

```typescript
app.delete("/users/:id", deleteData(User));
```

## Response Format

Successful responses follow a simple JSON structure, depending on the operation:

```json
{
  "success": true
}
```

Common success payloads include:

- `{ "success": true, "message": "Succes" }`
- `{ "success": true, "data": [...] }`
- `{ "success": true, "message": "Updated Successfully", "data": {} }`
- `{ "success": true, "message": "Successfully Deleted" }`

Validation failures return:

```json
{
  "success": false,
  "errors": {
    "fieldName": "field error message"
  }
}
```

## Error Handling

The handlers throw an `AppError` with a `statusCode` and message. In your Express app, add an error middleware to return proper API responses.

```typescript
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
```

## TypeScript Support

This package is written in TypeScript and builds declaration files into `dist`.

```typescript
import { addData, getData, updateData, deleteData } from "kj-mern-crud";
```

## Scripts

```bash
npm run build
```

Builds the TypeScript source from `src/` into `dist/`.

## Project Structure

```text
kj-mern-crud/
|- src/
|  |- core/
|  |  |- create.ts
|  |  |- delete.ts
|  |  |- get.ts
|  |  `- update.ts
|  |- utils/
|  |  `- error/
|  |     `- app-error.util.ts
|  `- index.ts
|- dist/
|- package.json
|- tsconfig.json
`- README.md
```

## Contributing

Contributions, bug reports, and suggestions are welcome. Improvements to filtering, validation flow, and response customization are all good places to extend the package.

## Future Enhancements

Possible future improvements:

- pagination support
- sorting and field selection
- custom response formatting
- soft delete support
- more advanced query operators
- tighter generic typing for Mongoose models

## License

ISC

## Author

**kristan1**

## Support

For issues, improvements, or feedback, use the repository where this package is maintained or the npm package page once published.
