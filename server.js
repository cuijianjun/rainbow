const egg = require('egg');

const workers = Number(process.argv[2] || require('os').cpus().length);
egg.startCluster({
  workers,
  baseDir: __dirname,
});

# 设定负载均衡后台服务器列表
upstream  rainbow-dev  {
    server   127.0.0.1:3002 max_fails=2 fail_timeout=30s;
}
server {
    listen  80; #指定Nginx监端口
    listen 443 ssl;
    server_name  rainbow-dev.pplu.vip;#用来指定IP或者域名
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    charset utf-8;#指定Nginx默认的字符集，只有utf-8支持中文字符
    client_max_body_size 50m;
    ssl on;
        ssl_certificate /work/ssl/rainbow-dev.pplu.vip/1935167_rainbow-dev.pplu.vip.pem;
        ssl_certificate_key /work/ssl/rainbow-dev.pplu.vip/1935167_rainbow-dev.pplu.vip.key;
        ssl_session_timeout 5m;
        ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers "HIGH:!aNULL:!MD5 or HIGH:!aNULL:!MD5:!3DES";
        ssl_prefer_server_ciphers on;
        location / {
            proxy_pass http://rainbow-dev;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           ##以下是一些反向代理的配置，可选。
            proxy_set_header Host $host;
            proxy_set_header X-Nginx-Proxy true;
            proxy_redirect off;
        }
    }

