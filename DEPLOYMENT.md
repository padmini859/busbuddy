# BusBuddy — Complete Production Deployment Guide

This guide covers 4 proven ways to deploy the **BusBuddy — Smart Local Bus Information System**:

1. [Option 1: Docker & Docker Compose (Recommended)](#option-1-docker--docker-compose-recommended)
2. [Option 2: Cloud VM / VPS Deployment (Ubuntu / AWS EC2 / DigitalOcean)](#option-2-cloud-vm--vps-deployment-ubuntu--aws-ec2)
3. [Option 3: Free Cloud PaaS (Render + Vercel + Aiven)](#option-3-free-cloud-paas-render--vercel--aiven)
4. [Option 4: All-in-One Embedded Executable JAR](#option-4-all-in-one-embedded-executable-jar)

---

## Option 1: Docker & Docker Compose (Recommended)

This runs the entire stack (MySQL 8.0 with pre-loaded demo data, Java 21 Spring Boot backend, and Nginx-powered React frontend) using one single command.

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) or Docker Engine + Compose (Linux).

### Steps
1. Navigate to the project root directory:
   ```bash
   cd "D:\Projects\Bus Buddy"
   ```

2. Start all 3 containers:
   ```bash
   docker compose up -d --build
   ```

3. Docker will automatically:
   - Start the **MySQL 8.0** container and initialize `busbuddy_db` using `01_schema.sql` and `02_seed.sql`.
   - Build and start the **Java 21 Spring Boot** container once MySQL passes health checks.
   - Build the **React Vite** production assets and serve them through an **Nginx** reverse-proxy.

4. **Access the application:**
   - **Frontend:** `http://localhost` (Port 80)
   - **Backend API:** `http://localhost:8080/api`
   - **Admin Login:** Username: `admin` | Password: `admin123`

5. To stop the containers:
   ```bash
   docker compose down
   ```

---

## Option 2: Cloud VM / VPS Deployment (Ubuntu / AWS EC2)

Deploying on an Ubuntu 22.04 / 24.04 server on AWS EC2, DigitalOcean Droplet, Linode, or Hetzner.

### Step 1: Install Dependencies on Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-21-jdk mysql-server nginx certbot python3-certbot-nginx git
```

### Step 2: Configure MySQL
```bash
sudo mysql
```
Inside MySQL prompt:
```sql
CREATE DATABASE busbuddy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'busbuddy_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON busbuddy_db.* TO 'busbuddy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Load the schema and seed data:
```bash
sudo mysql -u busbuddy_user -p busbuddy_db < busbuddy/database/schema.sql
sudo mysql -u busbuddy_user -p busbuddy_db < busbuddy/database/seed_demo_data.sql
```

### Step 3: Build & Deploy Backend as a Systemd Service
1. Package the backend JAR on your server:
   ```bash
   cd busbuddy/backend
   chmod +x mvnw
   ./mvnw clean package -DskipTests
   sudo mkdir -p /var/www/busbuddy
   sudo cp target/busbuddy-backend-1.0.0.jar /var/www/busbuddy/backend.jar
   ```

2. Create systemd service `/etc/systemd/system/busbuddy.service`:
   ```ini
   [Unit]
   Description=BusBuddy Spring Boot Backend
   After=syslog.target network.target mysql.service

   [Service]
   User=www-data
   Group=www-data
   Environment="MYSQL_USER=busbuddy_user"
   Environment="MYSQL_PASSWORD=StrongPassword123!"
   Environment="DB_HOST=localhost"
   Environment="DB_PORT=3306"
   Environment="DB_NAME=busbuddy_db"
   ExecStart=/usr/bin/java -jar /var/www/busbuddy/backend.jar
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable busbuddy
   sudo systemctl start busbuddy
   sudo systemctl status busbuddy
   ```

### Step 4: Build & Deploy React Frontend
1. Build frontend:
   ```bash
   cd ../frontend
   npm install
   npm run build
   sudo cp -r dist/* /var/www/html/
   ```

2. Configure Nginx `/etc/nginx/sites-available/busbuddy`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://127.0.0.1:8080/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Activate and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/busbuddy /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. Enable free HTTPS / SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## Option 3: Free Cloud PaaS (Render + Vercel + Aiven)

Ideal for academic project evaluation or portfolio demos with **\$0 cost**.

### 1. Database: Aiven (Free MySQL)
1. Sign up on [Aiven.io](https://aiven.io/).
2. Create a free MySQL service (e.g., in AWS Mumbai / Frankfurt region).
3. Connect using MySQL Workbench and execute `schema.sql` and `seed_demo_data.sql`.
4. Note down the Host, Port, Username, and Password.

### 2. Backend: Render (Free Web Service)
1. Push this project to GitHub.
2. Sign up on [Render.com](https://render.com/).
3. Click **New +** $\to$ **Web Service** $\to$ Connect your GitHub repo.
4. Set:
   - **Root Directory:** `busbuddy/backend`
   - **Runtime:** `Java` or `Docker`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/busbuddy-backend-1.0.0.jar`
5. Under **Environment Variables**, add:
   - `DB_HOST`: *(Aiven host)*
   - `DB_PORT`: *(Aiven port)*
   - `DB_NAME`: `busbuddy_db`
   - `MYSQL_USER`: `avnadmin`
   - `MYSQL_PASSWORD`: *(Aiven password)*
   - `JWT_SECRET`: `busbuddy_super_secure_jwt_secret_token_key_2026_at_least_256_bits_long_for_security`
6. Click **Deploy**. Render gives you a public URL (e.g. `https://busbuddy-backend.onrender.com`).

### 3. Frontend: Vercel (Free Static Hosting)
1. Sign up on [Vercel.com](https://vercel.com/).
2. Import the GitHub repository.
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `busbuddy/frontend`
   - **Environment Variable:**
     - `VITE_API_URL` = `https://busbuddy-backend.onrender.com/api`
4. Deploy! Your website will be live with a free SSL domain (e.g., `https://busbuddy.vercel.app`).

---

## Option 4: All-in-One Embedded Executable JAR

If you want to package the entire website and backend into a **single `.jar` file** so anyone with Java can run the entire site:

1. Build the frontend:
   ```bash
   cd "D:\Projects\Bus Buddy\busbuddy\frontend"
   npm run build
   ```
2. Copy the generated `dist/` contents into Spring Boot's static resources:
   ```bash
   # Create static directory if needed
   mkdir -p "..\backend\src\main\resources\static"
   cp -r dist/* "..\backend\src\main\resources\static\"
   ```
3. Re-package the backend JAR:
   ```bash
   cd "..\backend"
   .\mvnw.bat clean package -DskipTests
   ```
4. Now, simply running:
   ```bash
   java -jar target/busbuddy-backend-1.0.0.jar
   ```
   Serves **both the REST API and the React user interface** directly on **`http://localhost:8080`**!
