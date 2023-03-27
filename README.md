# OpenAI-Game - A web game made with the OpenAI API
## How to Configure and Run

{% note %}

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
