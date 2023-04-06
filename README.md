# Fullstack Software Engineering Tutorial
This code was created for a small tutorial on creating a web application with a connected database from scratch. [The YouTube tutorial can be found here!](https://www.youtube.com/watch?v=a4Z7YCcQZzM)

This application uses Angular for the frontend, MongoDB Atlas for the database, and Flask + PyMongo for the backend. The frontend is hosted on AWS S3, and the backend is hosted on AWS EC2 with help from Gunicorn and Nginx.

## Notes on code
Some of the code is different than what is used in the tutorial, but it should be mostly the same.

Also, this code currently does not work! The DatabaseService in the frontend is not set up to connect to a server, since I don't have the backend actively hosted anywhere at the moment (my AWS free tier is expired lol). Also, the backend folder does not have a `config.ini` file. This is because is is generally bad to have the config file, which contains the username and password for the MongoDB connection, publicly available.


Breakdown of steps/resources
==============================
## Angular Website
------------------------------
Angular: https://angular.io/

npm installer (with Node.js): https://nodejs.org/en

Awesome angular tutorial: https://ng-girls.gitbook.io/todo-list-tutorial/workshop-todo-list/introduction
(I did not use this tutorial in the video, but I found it very helpful when I was learning Angular!)

Useful commands
- Create a project

		ng new <project-name>
- Run website locally

		ng serve -o
- Add a component

		ng g c <component-name>
- Add a service

		ng g s <service-name>
- Build website for deployment

		ng build 

------------------------------
## Flask Server
------------------------------
Flask: https://flask.palletsprojects.com/en/2.2.x/

Getting started with PyMongo: https://www.mongodb.com/compatibility/setting-up-flask-with-mongodb

Useful Commands:
- Create a python virtual environment
		
		python3 -m venv <name-of-environment>

- Activate environment
	- Windows
			
			.\<venv-folder>\Scripts\activate

	- Mac/Linux

			source ./<venv-folder>/bin/activate

- Deactivate environment

		deactivate

- Install packages (like flask) with activated venv

		pip install <package-name>
	In this tutorial I install
	- flask
	- flask_pymongo
	- flask_cors
	- certifi

- Create requirements.txt file (with activated venv)

		pip freeze > requirements.txt

- Install packages based on requirements.txt file (with activated venv)

        pip install -r requirements.txt

------------------------------
## Connecting to Flask Server from Angular
------------------------------
Information about the javascript `fetch()` method: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

The top of the [`server.py` file](./backend-flask/server.py) has some useful notes for using this particular Flask server. 

In general, you can make an http request to the Flask server with javascript's `fetch(URL, request)` method.

- URL: the endpoint/route to connect to
- request: the request itself! A JSON-styled object:
        
        {
            method: 'GET',   // or 'PUT', or another method
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*' 
            },
            body: JSON.stringify(body)
        }

    The body is optional (useful for PUT requests), and can be defined as its own JSON object:

        const body = {
            field1: value1,
            field2: value2
        }
    
    If you are not using a body, you can leave it out of the http request entirely.

The fetch method will return an object of type `Promise<any>`.
You can do things with this promise asynchronously, with the `.then( <lambda function> )` method. As an example:

        fetch(URL, request).then(
            (response) => response.json() 
        ).then(
            (data) => {
                console.log("Red counter: " + data['redCount']);
                <insert any other code here>
            }
        );

The first `.then()` uses a single-line lambda function, which doesn't need brackets or a semicolon. The second lambda function is multi-lined, so it uses brackets and semicolons. 

The names 'response' and 'data' can be whatever you would like. They represent the data that is returned from a `Promise`. 'response' is the result of the fetch request, which is a Promise for json data. 'data' is the result of `response.json()`, which is the json data that comes from the first promise.


------------------------------
## Hosting Backend on EC2
------------------------------
Good tutorial: https://medium.com/techfront/step-by-step-visual-guide-on-deploying-a-flask-application-on-aws-ec2-8e3e8b82c4f7 (inludes GIFs showing the process)

Once you have an EC2 server (this tutorial uses one with Ubuntu), you can connect to it using the key-pair file you downloaded when creating the server, along with ssh from your terminal. Typically, this is just:

    ssh -i <location of .pem file> <user>@<url of EC2 server>

You can skip the `-i <location of .pem file>` part if you add the "identity" to your computer:

    ssh-add <location of .pem file>

To transfer files from your computer to the EC2 instance, you can use the following command:

    scp -i <location of .pem file> <file to transfer> <location to transfer>

The `<location to transfer>` will look something like this:

    ubuntu (or other user)@<EC2 ip address>:~/<folder on your EC2 server>

You can leave out the`-i` part if you added the identity to your computer.

Useful commands when you are in the linux terminal:

- Run any command with full permissions

        sudo <any command>

- List the files in your current directory

        ls

- Move to a different directory

        cd <name of directory>
    this can be the absolute path, or the relative path.

- Create a new directory

        mkdir <name of new directory>

- Edit / Create / View a file with VIM

        vim <name/path of file>

- Update the package manager

        sudo apt-get update

- Install python and the virtual environment

        sudo apt-get install python3-venv

- Logout of the SSH and get back to your normal terminal

        logout

By default, you start out in your *user directory*. You can always get the user directory by starting the path with `~`.

`ls ~/folder` will list the files in the 'folder' directory in your user's folder. The user is always listed on the left side of the terminal, before the `@` sign with the server's IP address.

On the server, make a new directory and transfer the following files:
- server.py
- requirements.txt
- config.ini

Then create a new virtual environment for the python server with

    python3 -m venv venv

Activate the virtual environment

    source venv/bin/activate

Install the packages

    pip install -r requirements.txt

Try running the server!

    python3 server.py

Stop the server with Ctrl+C.

Install gunicorn

    pip install gunicorn

Try running gunicorn with:

    gunicorn -b 0.0.0.0:8000 server:app

`server` is the name of the python file, and `app` is the name of the Flask app variable.

### Using VIM to edit files
Vim has 3 modes: Normal, Insert, and Command. You can always press escape to go into normal mode. You can move around a document with the arrow keys, or hjkl if you do not have arrow keys.

From normal mode, press `i` to go into insert mode. You should see ` -- Insert -- ` in the bottom left corner of the terminal. In insert mode, you can type to edit text.

From normal mode, press `u` to undo changes you make.

From normal mode, press `:` to begin to enter a command. You should see `:` in the bottom left corner.
Some useful commands:
- `x` - Save and close
- `q` - Close (only works if you have no unsaved changes)
- `q!` - Close WITHOUT saving
- `w` - Save without closing


### Using linux services to run the server
This part is taken directly from [this online tutorial](https://medium.com/techfront/step-by-step-visual-guide-on-deploying-a-flask-application-on-aws-ec2-8e3e8b82c4f7).

Create a service with VIM:

    sudo vim /etc/systemd/system/<service name>.service

Remember your sevice name!

Then add this text to the file:
```
[Unit]
Description=<any description>
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/<server-folder>
ExecStart=/home/ubuntu/<server-folder>/venv/bin/gunicorn -b localhost:8000 server:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Make sure to replace `<server-folder>` with the directory your Flask server and virtual environment are in. Save and close the file in VIM by pressing `esc` to go to normal mode, `:` to go to command mode, and `x` to save and close.

Enable the service in the terminal with:

    sudo systemctl daemon-reload
    sudo systemctl start <service name>
    sudo systemctl enable <service name>

If you ever make changes to `server.py`, reload the server with: 

    sudo systemctl restart <service name>

To allow for the user/angular site to connect to the flask server, we use NGINX.

Install NGINX:

    sudo apt-get install nginx

Run NGINX:

    sudo systemctl start nginx
    sudo systemctl enable nginx

You can now go to the EC2's public IP address to see if nginx is working!

To set it up to send requests to our flask server, we will change the nginx configuration.

Edit the configuration file with:

    sudo vim /etc/nginx/sites-available/default

At the top of the file, we can specify our flask server! Underneath the first comment block, before the first set of brackets, we can add:

```
upstream <server name> {
    server 127.0.0.1:8000
}
```
This creates an nginx "server" at localhost, where the flask server is.

If you scroll down, inside of the large section with brackets, find the section that looks like:

```
location / {
    <some code here>
}
```
and change it to:

```
location / {
    proxy_pass http://<server name>;
}
```
where the `<server name>` is the one we created at the top of the file.

Now run the following command to restart nginx:

    sudo systemctl restart nginx

You should now be able to access the flask server from the EC2 server's public IP address!


------------------------------
## Hosting Frontend on S3
------------------------------
When you create the S3 bucket, make sure to uncheck the boxes that block access to the bucket.

Under the Properties section of the bucket, at the very bottom, you can enable static hosting.

With an angular site, make sure that the index document and error document are both `index.html`.

Under the Permissions section of the bucket, you can check that those checkmarks for blocking access are unchecked (if you didn't do that when creating the bucket), and you click `Edit` next to the Bucket policies to add the following policy:

```
"Statement": {
    {
        "Sid": "AddPermission",
        "Principal": "*",
        "Effect": "Allow",
        "Action": "sd:GetObject",
        "Resource": "<copy Bucket ARN here>/*"
    }
}
```

At the bottom of the Properties section of the bucket, you should find the URL for the website!

To get the Angular site on the Bucket:

Build your angular application with:

    ng build

Locate the build in `<project folder>/dist/<project name>`

Upload the files in this folder to the bucket with the Add Files button (make sure that the files like `index.html` are in the bucket directly, and not inside of a folder inside of the bucket).

You should be able to see your website at the link (found at the bottom of the Properties section, in the Static Website Hosting section)

# Concluding Remarks
I hope this tutorial/guide is able to help you in some way! If anything is unclear, or if you have any questions, feel free to reach out to me. I would love to help clarify things!
