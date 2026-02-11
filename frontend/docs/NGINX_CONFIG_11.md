server {
listen 443 ssl;
listen [::]:443 ssl;
server_name vietsign.ibme.edu.vn;
error_log /var/log/nginx/vietsign-ibme-edu-vn-error.log;
access_log /var/log/nginx/vietsign-ibme-edu-vn-access.log;

    location ~ /ai-service {
        client_max_body_size 500M;
        rewrite ^/ai-service/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8040;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /user-service {
        client_max_body_size 500M;
        rewrite ^/user-service/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8080;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /service-chat {
        client_max_body_size 500M;
        rewrite ^/service-chat/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8050;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /learning-service {
        client_max_body_size 500M;
        rewrite ^/learning-service/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8060;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /data-collection-service {
        client_max_body_size 500M;
        rewrite ^/data-collection-service/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8090;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /upload {
        client_max_body_size 500M;
        rewrite ^/upload/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:9001;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /socket-chat {
        client_max_body_size 500M;
        rewrite ^/socket-chat/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8055;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /emg-label-tool {
        client_max_body_size 500M;
        rewrite ^/emg-label-tool/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8045;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /ai/t2 {
        client_max_body_size 500M;
        rewrite ^/ai/t2/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8046;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /ai/t3 {
        client_max_body_size 500M;
        rewrite ^/ai/t3/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8047;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /chuyen/datn {
        client_max_body_size 500M;
        rewrite ^/chuyen/datn/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8040;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /v3 {
        client_max_body_size 500M;
        rewrite ^/v3/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:8088;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location ~ / {
        client_max_body_size 500M;
        rewrite ^/?(.*)$ /$1 break;
        proxy_pass http://202.191.100.9:3000;
        proxy_pass_header  Access-Control-Allow-Origin;
        proxy_pass_header  Access-Control-Allow-Methods;
        proxy_pass_header  Access-Control-Allow-Headers;
        proxy_pass_header  Authorization;
        proxy_set_header   Host vietsign.ibme.edu.vn;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

}
