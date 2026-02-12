# CẤU HÌNH MÁY .09 (APP SERVER) - KHỚP 100% VỚI MÁY .11

# File: /etc/nginx/sites-available/vietsign

# ==========================================================

# LƯU Ý QUAN TRỌNG:

# Máy .11 đang gọi vào các cổng sau của Máy .09:

# - Frontend: Cổng 3000

# - Backend: Cổng 8080

# - AI Service: Cổng 8040

#

# => BẠN BẮT BUỘC PHẢI MỞ FIREWALL (UFW) CÁC CỔNG NÀY TRÊN MÁY .09

# Lệnh mở:

# sudo ufw allow 3000/tcp

# sudo ufw allow 8080/tcp

# sudo ufw allow 8040/tcp

# ==========================================================

# --- 1. FRONTEND (Máy .11 gọi vào cổng 3000) ---

server {
listen 3000 default*server;
server_name vietsign.ibme.edu.vn *;

    location / {
        # Trỏ vào NodePort Frontend đang chạy (31755)
        proxy_pass http://127.0.0.1:31755;

        # Header chuẩn
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

}

# --- 2. BACKEND / USER SERVICE (Máy .11 gọi vào cổng 8080) ---

server {
listen 8080 default*server;
server_name vietsign.ibme.edu.vn *;

    # Case 1: Nếu còn prefix /user-service (Máy .11 chưa strip)
    location /user-service/ {
        # Dùng trailing slash ở proxy_pass để Nginx tự động strip /user-service/
        proxy_pass http://127.0.0.1:30080/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Case 2: Nếu đã strip prefix (Máy .11 đã strip, chỉ còn /...)
    location / {
        proxy_pass http://127.0.0.1:30080;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

}

# --- 3. CÁC SERVICE KHÁC (Cấu hình tương tự nếu cần) ---

# AI Service (Cổng 8040)

server {
listen 8040;
server*name vietsign.ibme.edu.vn *;
location / { # Nếu có NodePort cho AI, thay vào đây. Tạm thời trỏ vào Local
proxy_pass http://127.0.0.1:8041;
}
}
