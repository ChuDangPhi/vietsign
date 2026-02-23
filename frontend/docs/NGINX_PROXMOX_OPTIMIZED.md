# KIẾN TRÚC TỐI ƯU NGINX PROXY - HỆ THỐNG PROXMOX VIETSIGN

Do Proxmox PVE quản lý NAT/Forwarding kém và cấu hình Nginx cũ trên máy Public Gateway (`.11`) phân mảnh, việc quản lý và trace lỗi (như lỗi 404 vừa qua) rất mất thời gian. Dựa trên sơ đồ mạng đính kèm, phương án cấu hình chuẩn sẽ là **"Đẩy logic điều tuyến về 1 nơi duy nhất (App Server .09)"**.

Cụ thể:

1. **Máy .11 (Public Gateway):** Trở thành thiết bị "Dumb Proxy" thông lượng cao. Nhiệm vụ duy nhất: Giải mã SSL (Cổng 443) trên domain `vietsign.ibme.edu.vn` và đẩy 100% traffic thô vào máy `.09`. Không cắt ghép URL.
2. **Máy .09 (App Server):** Trở thành **Trung tâm Điều Phối Duy Nhất**. Nginx trên máy `.09` sẽ đọc URL và chia vào các Container/NodePort tương ứng (Frontend `31755`, Backend `30080`, AI Services, MinIO `9001`).

Giảm thiểu tối đa việc phải mở lắt nhắt nhiều Port trên Firewall của máy `.09`.

---

## 1. MÁY .11 - CẤU HÌNH RÚT GỌN (PUBLIC GATEWAY)

Trên máy `.11`, bạn thay thế file NGINX_CONFIG_11 bằng một Block Server duy nhất:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name vietsign.ibme.edu.vn;

    # SSL Certificates (Giữ nguyên cấu hình file cer/pem hiện tại của bạn)
    # ssl_certificate /path/to/cert...

    error_log /var/log/nginx/vietsign-ibme-edu-vn-error.log;
    access_log /var/log/nginx/vietsign-ibme-edu-vn-access.log;

    # ĐẨY TOÀN BỘ TRAFFIC VỀ MÁY .09 MÀ KHÔNG CẮT STRIP URL
    location / {
        client_max_body_size 500M;
        proxy_pass http://202.191.100.9:80; # Gửi vào cổng 80 của Nginx trên .09

        # Chuyển tiếp các Client Headers chuẩn
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Hỗ trợ Websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 2. MÁY .09 - TRUNG TÂM ĐIỀU PHỐI (APP SERVER)

Tại máy `.09` (Địa chỉ Private IP `202.191.100.9`), Nginx sẽ lắng nghe ở một cổng duy nhất là **Cổng 80** để hứng lưu lượng từ máy `.11` gửi qua.

> **Lưu ý Firewall:** Máy `.09` nay **CHỈ CẦN** mở cổng 80 cho máy `.11` truy cập (`sudo ufw allow 80`). Đóng các cổng 8080, 8040, 8050 phơi ra ngoài, tăng tính bảo mật cho cụm Server.

Tạo/Sửa file config Nginx trên máy `.09` (Cổng 80):

```nginx
server {
    listen 80 default_server;
    server_name vietsign.ibme.edu.vn _;

    error_log /var/log/nginx/gateway-09-error.log;
    access_log /var/log/nginx/gateway-09-access.log;

    # =============== CÁC MICROSERVICES BACKEND ===============
    # Nếu URL có chữ /user-service/ -> Chuyển vào NodePort Backend 30080
    location /user-service/ {
        # Toán tử regex trailing slash này cực kỳ quan trọng, nó thay thế hàm Rewrite Break
        # Sẽ loại bỏ url '/user-service/' và chỉ gửi '/learn/topics' vào port 30080
        proxy_pass http://127.0.0.1:30080/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # =============== TÀI KHOẢN VÀ LƯU TRỮ ====================
    location /upload/ {
        proxy_pass http://127.0.0.1:9001/; # Minio Webport

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 500M;
    }

    # =============== CÁC DỊCH VỤ AI BỔ SUNG ==================
    location /ai-service/ {
        proxy_pass http://127.0.0.1:8040/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 500M;
    }

    location /ai/t2/ {
        proxy_pass http://127.0.0.1:8046/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 500M;
    }

    location /ai/t3/ {
        proxy_pass http://127.0.0.1:8047/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 500M;
    }

    # Websocket Chat Service
    location /socket-chat/ {
        proxy_pass http://127.0.0.1:8055/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /service-chat/ {
        proxy_pass http://127.0.0.1:8050/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Các service cũ khác cần duy trì
    location /learning-service/ {
        proxy_pass http://127.0.0.1:8060/;
        proxy_set_header Host $host;
    }

    location /data-collection-service/ {
        proxy_pass http://127.0.0.1:8090/;
        proxy_set_header Host $host;
    }

    location /v3/ {
        proxy_pass http://127.0.0.1:8088/;
        proxy_set_header Host $host;
    }

    # =============== GIAO DIỆN FRONTEND (MẶC ĐỊNH) ===========
    # Tất cả các đường dẫn khác (không match các lệnh trên) -> Chuyển về Frontend Port 31755
    location / {
        proxy_pass http://127.0.0.1:31755;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Websocket dành cho React Fast Refresh / Socket.IO
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

### Lợi ích của Kiến trúc này:

1. **Dễ hiểu, Dễ sửa (Single Source of Truth)**: Mai này có sửa cổng, thêm service, hay đổi Backend NodePort, bạn CHỈ CẦN sửa 1 File Nginx duy nhất trên Server `.09`.
2. **Quy tắc an ninh thắt chặt**: Các Container bên trong như AI Engine (8040), Backend (8080/30080), Chat (8050) hoàn toàn nằm trong vùng IP 127.0.0.1 nội bộ của `.09` -> Tuyệt đối an toàn trước tấn công dò port thẳng vào qua IP public.
3. Không bị xung đột tham số `rewrite` lắt nhắt như cũ vì Nginx Proxy Pass kèm theo một dấu trailing `/` (dấu suỵt ở cuối địa chỉ target) sẽ tự động làm nhiệm vụ Trim Path (Tự độ cắt prefix URL) rất mượt mà. Đảm bảo đúng với mô hình trên Proxmox bạn gửi.
