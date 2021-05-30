# HTTPS using NGINX

A simple way to host the web interface/webfeed over HTTPS is to use NGINX (free).

Download NGINX and copy the files from this folder into the conf/ folder of NGINX. Replace the existing nginx.conf.

If you are using a port other than 8080 for the web interface then you should edit nginx.conf and replace the 8080 on the "proxypass" line.

Replace conf/cert.cert and conf/cert.key with your own certificate and key.

### Using HTTPS without your own certificate (for testing)

You can use the provided certificate, however, you will first need to import the provided cert.pfx on your Windows clients (into Local Machine/Trusted Root Certification Authorities). The password is: Password1

You will then need to access the server using the hostname "remoteapp.server". This should be added to the *hosts file* on the clients to resolve to the correct IP address.

