```nginx
# CẤU HÌNH ĐẦY ĐỦ NGINX MÁY .09
# (Tương thích lệnh gọi từ máy .11 hiện tại đang phân mảnh nhiều Port)
# Đường dẫn trên máy .09: /etc/nginx/sites-available/vietsign

# ------------------------------------------------------------------
# 1. FRONTEND - Máy .11 Proxy_pass vào cổng 3000
# ------------------------------------------------------------------
server {
    listen 3000 default_server;
    server_name vietsign.ibme.edu.vn _;

    # Nếu truy cập chuẩn từ root
    location / {
        proxy_pass http://127.0.0.1:31755; # NodePort Frontend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Bắt dự phòng do Frontend gọi API mà URL chưa bị Nginx .11 strip
    location /user-service/ {
        proxy_pass http://127.0.0.1:30080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# ------------------------------------------------------------------
# 2. BACKEND / USER-SERVICE - Máy .11 Proxy_pass vào cổng 8080
# ------------------------------------------------------------------
server {
    listen 8080;
    server_name vietsign.ibme.edu.vn _;

    location /user-service/ {
        # Cắt /user-service/ trước khi đưa vào NodePort Backend
        proxy_pass http://127.0.0.1:30080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        # Đã bị stripe ở máy .11 rồi, vào thẳng
        proxy_pass http://127.0.0.1:30080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# ------------------------------------------------------------------
# 3. LEARNING SERVICE - Máy .11 Proxy_pass vào cổng 8060
# (Đã gộp chung vào Backend NodeJS ở cổng 30080)
# ------------------------------------------------------------------
server {
    listen 8060;
    server_name vietsign.ibme.edu.vn _;

    location /learning-service/ {
        proxy_pass http://127.0.0.1:30080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:30080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# ------------------------------------------------------------------
# 4. UPLOAD / MINIO - Máy .11 Proxy_pass vào cổng 9001
# ------------------------------------------------------------------
server {
    listen 9001;
    server_name vietsign.ibme.edu.vn _;

    client_max_body_size 500M;

    location /upload/ {
        proxy_pass http://127.0.0.1:9001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# ------------------------------------------------------------------
# 5. AI SERVICES VÀ CHUYÊN ĐỀ - Cổng 8040, 8046, 8047, 8045
# ------------------------------------------------------------------
server {
    listen 8040; # /ai-service và /chuyen/datn
    server_name vietsign.ibme.edu.vn _;
    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:8041; # Port nội bộ chạy server AI
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 8046; # /ai/t2/
    server_name vietsign.ibme.edu.vn _;
    client_max_body_size 500M;
    location / { proxy_pass http://127.0.0.1:8042; }
}

server {
    listen 8047; # /ai/t3/
    server_name vietsign.ibme.edu.vn _;
    client_max_body_size 500M;
    location / { proxy_pass http://127.0.0.1:8043; }
}

server {
    listen 8045; # /emg-label-tool
    server_name vietsign.ibme.edu.vn _;
    client_max_body_size 500M;
    location / { proxy_pass http://127.0.0.1:8045; }
}

# ------------------------------------------------------------------
# 6. DATA COLLECTION - Máy .11 gọi 8090
# ------------------------------------------------------------------
server {
    listen 8090;
    server_name vietsign.ibme.edu.vn _;

    location / {
        # Đã gộp vào Backend mới
        proxy_pass http://127.0.0.1:30080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# ------------------------------------------------------------------
# 7. SERVICE CHAT VÀ WEBSOCKET - 8050, 8055
# ------------------------------------------------------------------
server {
    listen 8050; # /service-chat
    server_name vietsign.ibme.edu.vn _;
    location / {
        proxy_pass http://127.0.0.1:8050;
        proxy_set_header Host $host;
    }
}

server {
    listen 8055; # /socket-chat
    server_name vietsign.ibme.edu.vn _;
    location / {
        proxy_pass http://127.0.0.1:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
