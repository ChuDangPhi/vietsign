# Cấu hình Nginx cho máy App Server (.09)

```nginx
# ==========================================================
# FILE CẤU HÌNH NGINX MÁY .09 - DỰ ÁN VIETSIGN
# ==========================================================

# Cấu hình Proxy chung
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;

# --- GIAO DIỆN FRONTEND (Cổng 3000) ---
server {
    listen 3000;
    server_name vietsign.ibme.edu.vn;

    location / {
        proxy_pass http://127.0.0.1:3001;
    }
}

# --- BACKEND / USER SERVICE (Cổng 8080) ---
server {
    listen 8080;
    server_name vietsign.ibme.edu.vn;

    location / {
        proxy_pass http://127.0.0.1:5001;
    }
}

# --- AI SERVICE / ĐATN (Cổng 8040) ---
server {
    listen 8040;
    server_name vietsign.ibme.edu.vn;

    location / {
        proxy_pass http://127.0.0.1:8041;
    }
}

# --- UPLOAD / MINIO (Cổng 9001) ---
server {
    listen 9001;
    location / {
        proxy_pass http://127.0.0.1:9001;
    }
}

# --- SERVICE CHAT (Cổng 8050) ---
server {
    listen 8050;
    location / {
        proxy_pass http://127.0.0.1:8050;
    }
}

# --- LEARNING SERVICE (Cổng 8060) ---
server {
    listen 8060;
    location / {
        proxy_pass http://127.0.0.1:8060;
    }
}

# --- DATA COLLECTION (Cổng 8090) ---
server {
    listen 8090;
    location / {
        proxy_pass http://127.0.0.1:8090;
    }
}

# --- SOCKET CHAT (Cổng 8055) ---
server {
    listen 8055;
    location / {
        proxy_pass http://127.0.0.1:8055;
    }
}
```
