# 🍰 MbeautyCakes

A full-stack cake delivery web application built with React, Node.js, Express, MySQL, Docker, Nginx, and AWS.

MbeautyCakes allows customers to browse cakes, choose cake weights, manage their cart, place orders, track orders, and manage their profile.

---

## 🚀 Features

### Customer Features

- Browse available cakes
- Filter cakes by category
- Select cake weight:
  - 250g
  - 500g
  - 1Kg
- Dynamic pricing based on selected weight
- Add cakes to cart
- Increase/decrease cart quantity
- Remove items from cart
- User registration and login
- Profile section
- Checkout and delivery details
- Place orders
- View previous orders
- Track order status

### Admin Features

- Admin authentication
- View customer orders
- View order details
- Update order status
- Order tracking workflow

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Vite
- CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- REST API

### Database

- MySQL 8.0

### DevOps / Deployment

- Docker
- Docker Compose
- Nginx
- Git
- GitHub
- AWS EC2

---

## 🏗️ Architecture

```text
                        Internet
                           │
                           ▼
                 ┌──────────────────┐
                 │      Nginx       │
                 │ React Frontend   │
                 │      :80         │
                 └────────┬─────────┘
                          │
                       /api/*
                          │
                          ▼
                 ┌──────────────────┐
                 │     Backend      │
                 │ Node + Express   │
                 │      :5000       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │      MySQL       │
                 │      :3306       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Docker Volume    │
                 │ Persistent Data  │
                 └──────────────────┘
```

## 🐳 Docker Architecture

The application is divided into three main containers:

```text
mbeautycakes-frontend
        │
        │ Nginx
        ▼
mbeautycakes-backend
        │
        ▼
mbeautycakes-mysql
```

Docker Compose provides:

- Service networking
- Container orchestration
- Persistent MySQL volume
- Container health checks
- Automatic restart policies


## 📁 Project Structure

```text
mbeautycakes/
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js
│   └── db.js
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── database/
│   └── schema.sql
│
├── docker-compose.yml
├── .gitignore
└── README.md
```


## ▶️ Run the Project Locally

### Prerequisites

Make sure the following are installed:

- Git
- Docker Desktop
- Docker Compose


### Clone the repository

```bash
git clone https://github.com/HiteshGupta03/mbeautycakes.git
```

Move into the project:

```bash
cd mbeautycakes
```


## ⚙️ Environment Variables

Create the required environment file locally:

```text
backend/.env
```

Do not commit `.env` files to GitHub.

Sensitive values such as passwords and JWT secrets should remain private.


## 🐳 Run with Docker Compose

From the project root:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Expected services:

```text
mbeautycakes-frontend
mbeautycakes-backend
mbeautycakes-mysql
```


## 🌐 Access the Application

Open:

```text
http://localhost
```

Backend API:

```text
http://localhost/api/cakes
```


## 🔍 Useful Docker Commands

### Check containers

```bash
docker compose ps
```

### View all logs

```bash
docker compose logs
```

### Backend logs

```bash
docker compose logs backend
```

### Frontend logs

```bash
docker compose logs frontend
```

### MySQL logs

```bash
docker compose logs mysql
```

### Stop the application

```bash
docker compose down
```

### Rebuild containers

```bash
docker compose up -d --build
```

### Check Docker images

```bash
docker images
```


## 💾 Database Persistence

MySQL data is stored in a Docker named volume:

```text
mbeautycakes_mysql_data
```

This allows database data to survive container restarts and container recreation.

The database schema is stored in:

```text
database/schema.sql
```


## ☁️ AWS Deployment

The application is designed to be deployed on an AWS EC2 instance using Docker Compose.

Deployment flow:

```text
GitHub
   │
   ▼
AWS EC2
   │
   ▼
Docker
   │
   ▼
Docker Compose
   │
   ├── Frontend + Nginx
   ├── Backend
   └── MySQL
   │
   ▼
Public IP
```

### Planned AWS setup

- Ubuntu EC2 instance
- Docker
- Docker Compose
- Security Group
- Nginx
- Persistent Docker volume
- Public HTTP access


## 🔐 Security

Sensitive files are excluded using `.gitignore`.

Examples:

```text
.env
backend/.env
database/*-backup.sql
```

The MySQL database is intended for internal Docker communication rather than public internet access.


## 📌 Current Status

### Application

- ✅ React frontend
- ✅ Node.js / Express backend
- ✅ MySQL database
- ✅ User authentication
- ✅ Cart functionality
- ✅ Checkout
- ✅ Order management
- ✅ Category filtering

### Docker

- ✅ Frontend Docker image
- ✅ Multi-stage frontend build
- ✅ Nginx
- ✅ Backend container
- ✅ MySQL container
- ✅ Docker Compose
- ✅ Persistent MySQL volume
- ✅ Service networking
- ✅ Health checks

### Version Control

- ✅ Git repository
- ✅ GitHub repository
- ✅ Public repository

### Deployment

- ⏳ AWS EC2 deployment
- ⏳ Production public URL
- ⏳ HTTPS / domain configuration


## 🎯 Future Improvements

- Online payment integration
- Email order notifications
- Custom cake orders
- Birthday and wedding cake collections
- Product search
- Wishlist persistence
- HTTPS with custom domain
- CI/CD pipeline
- AWS managed database integration


## 👨‍💻 Author

**Hitesh Gupta**

GitHub:

https://github.com/HiteshGupta03

Repository:

https://github.com/HiteshGupta03/mbeautycakes
