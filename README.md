# OpenAI-Game - A web game made with the OpenAI API
## Note: This app previously used PHP and was recently upgraded to NodeJS. The old PHP is in script.php.old and is no longer used. If you would like to use PHP, you can rename this file to script.php and modify the submit.js to fetch from script.php amd see Old Instructions for PHP.
## How to Configure and Run
### Using a local machine and environment variables
1. Clone or download this repo 
2. Set the environment varialbe for OPENAI_API_KEY to your OpenAI API Key
3. Ensure that `const UseAWS = false;` is set at the top of the server.js file
4. Create a .env file in the repo folder with the following: `OPENAI_API_KEY="[REPLACE_WITH_YOUR_KEY]"`
5. Open a terminal window and navigate to the repo folder and run `npm install` (note you must have Node installed). This will install the proper node packages.
6. In the terminal with the repo folder navigated to, start the server with `node server.js` this will run the server on port 8000.
7. Open the Index.html file

### Using AWS EC2 + SSM Parameter Store
1. Create an EC2 server and install Apache (https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateWebServer.html)
2. Place the files from this repository in the /var/www/html folder
3. Open up the necessary ports to your EC2 server (80 for HTTP and 443 for HTTPS)
4. Create a secret in SSM Parameter store called OPENAI_API_KEY and set this to your OpenAI API Key
5. Attach a role to your EC2 instance that allows access to this key
6. Ensure that `const UseAWS = true;` is set at the top of the server.js file and that the proper details are put into the $ssmClient creation (you likely will need to just change the region if you created your EC2 instance in a different region)
7. SSH into your EC2 instance and navicate to the /var/www/html folder and run `npm install` (note you must have Node installed). This will install the proper node packages.
8. In the same /var/www/html folder you should now be able to run `node server.js` this will run the server on port 8000.
9. In your browser, navigate to the public DNS of your EC2 server and you should see the game running (Note: since this is running on an insecure URL (unless you buy a domain or setup a CDN), you must turn off your ad-blocker for the game. If the game does not work, you should be able to take a look at any console errors from the browser)

## Old Instructions for PHP
### Using a local machine and environment variables
1. Clone or download this repo 
2. Set the environment varialbe for OPENAI_API_KEY to your OpenAI API Key
3. Ensure that `define('UseAWS', false);` is set at the top of the script.php file
4. Navigate to the repo folder and start an HTTP server (I used PHP - See https://www.php.net/manual/en/features.commandline.webserver.php for more details and https://www.php.net/manual/en/install.php for installation) then in your browser navigate to http://[localhost]:[port] of your local web server

### Using AWS EC2 + SSM Parameter Store
1. Create an EC2 server and install Apache (https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateWebServer.html)
2. Place the files from this repository in the /var/www/html folder
3. Open up the necessary ports to your EC2 server (80 for HTTP and 443 for HTTPS)
4. Create a secret in SSM Parameter store called OPENAI_API_KEY and set this to your OpenAI API Key
5. Attach a role to your EC2 instance that allows access to this key
6. Ensure that `define('UseAWS', true);` is set at the top of the script.php file and that the proper details are put into the $ssmClient creation (you likely will need to just change the region if you created your EC2 instance in a different region)
7. In your browser, navigate to the public DNS of your EC2 server and you should see the game running
