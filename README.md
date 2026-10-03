# Store Rating System

A full-stack web application where users can view stores and submit ratings from 1 to 5.

## Features

- User registration and login
- JWT based authentication
- Role based access
- Admin dashboard
- Store management
- User management
- Store rating submission
- Update existing rating
- Store search
- User search and filters
- Sorting for listing tables
- Store owner dashboard
- Password update
- PostgreSQL database

## User Roles

### System Administrator

- View dashboard statistics
- Manage users
- Add users
- View user details
- Manage stores
- Add stores
- Filter and sort users and stores

### Normal User

- Register and login
- View available stores
- Search stores by name or address
- Submit a rating from 1 to 5
- Update submitted rating
- View overall store rating
- Update password

### Store Owner

- Login
- View store dashboard
- View average store rating
- View total ratings
- View users who rated the store
- Update password

## Tech Stack

### Frontend

- React.js
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs

### Database

- PostgreSQL

## Project Structure

```text
StoreRatingSystem/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md