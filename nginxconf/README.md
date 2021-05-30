# HTTPS using NGINX

A simple way to host the web interface/webfeed over HTTPS is to use NGINX (free).

Download NGINX and copy the files from this folder into the conf/ folder of NGINX. Replace the existing nginx.conf.

Replace conf/cert.cert and conf/cert.key with your own certificate and key.

If you are using a port other than 8080 for the web interface then you should edit nginx.conf and replace the 8080 on the "proxypass" line.

