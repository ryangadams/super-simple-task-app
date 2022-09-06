# Super Simple Tasks

Created as a hacky demo of cloudfront and ec2.

Designed to be run on EC2 with a cloudfront distribution in front of it.

## Setting up the RestApi

The rest api uses json-server to make it easy.

1. Install node js on the EC2 instance. [This article](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html) suggests using nvm to install nodejs, and it's pretty straightforward. You'll need to log out and back in again to EC2 to get nvm in your path.
2. Get the code from `./restapp` onto the server (git clone maybe) and install the node modules using `npm install`
3. You may need to configure the server by modifying `json-server.json` - I have it listening on 0.0.0.0 and port 8000 (depends on what port you added to your ec2 security group)
4. you can run this using `npm start` now, but as soon as you close the session it will stop running. I used [pm2](https://pm2.keymetrics.io/)  to manage running it persistently. The command I used was `pm2 start npm --name "backend" -- start`
5. And you're done (apart from cloudfront) - now you can visit your EC2 instances via IP and port to view your restAPI (e.g. http://34.249.119.149:8000/tasks - that IP is probably incorrect now).

## Setting up the Website

1. You'll need nginx installed. That should be possible via `sudo amazon-linux-extras install nginx1` and then starting it via `sudo systemctl start nginx`
2. Your content root is `/usr/share/nginx/html` by default. Either put the website there, or modify your content root by editing the nginx conf at `/etc/nginx/nginx.conf` - my server conf section is copied below for reference. You may need to modify directory permissions of your new content root to let nginx read those files.


```
server {
    listen       80;
    listen       [::]:80;
    server_name  _;
    root         /home/ec2-user/webroot;
    # This was the original
    # root         /usr/share/nginx/html;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /404.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}
```
