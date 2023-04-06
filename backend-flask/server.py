'''
server.py

Simple Flask server to allow connections with the MongoDB Atlas database.

NOTE: In order for this server to work:
    - The database cluster must have a database named 'counters'
    - The 'counters' databas must have 2 documents:
        One with name: red
        One with name: blue
        Both of them need a count: field with an integer type
    - This file must be run from the same folder as a file 'config.ini' which needs:
        [Database]
        DB_URI = <mongo connection string>

USAGE: 
    - Run this server somewhere
    - Connect to the server over http
    - Use one of the following requests to interact with the database:
        - /get-red, /get-blue (GET)
            Returns the MongoDB document for the red or blue counter
        - /set-red, /set-blue (PUT)
            Body: { redCount/blueCount: <count> }
            Sets the 'count' field of the red or blue counter document in MongoDB
        - / (GET)
            Returns 'Hello World!' html to verify the Flask server is working

If you are having trouble connecting to this server when it is hosted on AWS, try seeing if you are
connecting to this server with http or https. You may have to connect only with http.

@author Alex Wills
@author PyMongo tutorial: https://www.mongodb.com/compatibility/setting-up-flask-with-mongodb
@date April 4, 2023
'''
import configparser     # Reading the config file
import os
from flask import Flask, current_app, g, request    # Creating a flask server
from flask_pymongo import PyMongo   # Connecting to MongoDB
from flask_cors import CORS, cross_origin   # CORS connections
from werkzeug.local import LocalProxy   # Something from MongoDB tutorial
import certifi  # Creating a network certificate


# ------------ Setting up the Flask app ------------ #

# Create a global flask app
app = Flask(__name__)
CORS(app)

# Read config.ini
config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join("config.ini")))

# Configure flask app
app.config["MONGO_URI"] = config['Database']['DB_URI']
app.config["DEBUG"] = False

# Create network certificate
certificate = certifi.where()


# Configure the database (from MongoDB Tutorial: https://www.mongodb.com/compatibility/setting-up-flask-with-mongodb)
def get_db():
    """
    Configuration method to return db instance
    """
    db = getattr(g, "_database", None)

    if db is None:

        db = g._database = PyMongo(current_app, tlsCAFile=certificate).db
       
    return db

# Use LocalProxy to read the global db instance with just `db`
db = LocalProxy(get_db)


# ------------ Routing requests to the Flask app ------------ #

@app.route("/")
def home_page():
    '''
    Returns html for the home page of the server.
    '''
    return "<p> Hello World! </p>"


@app.route("/get-red")
@cross_origin()
def get_red_counter():
    '''
    Accesses the red counter from the database.
    @return - the red counter document
    '''
    query = {'name': 'red'} # Query for PyMongo
    counter = db.counters.find_one(query, {"_id": False})   # Search with the query, removing the _id field
    return counter  # Return the database entry

@app.route("/get-blue")
@cross_origin()
def get_blue_counter():
    '''
    Accesses the blue counter from the database.
    @return - the blue counter document
    '''
    query = {'name': 'blue'} # Query for PyMongo
    counter = db.counters.find_one(query, {"_id": False})   # Search with the query, removing the _id field
    return counter  # Return the database entry

@app.put("/set-red")
@cross_origin()
def set_red_counter():
    '''
    Updates the red counter value in the database.
    Request should contain a body with a 'redCount' field that has
        the value to set the red counter to.
    '''

    # Get the PUT request body and access the 'redCount' field
    body = request.json
    redCount = body['redCount']

    # Update 1 document matching the query by setting the value of count
    query = {'name': 'red'}
    db.counters.update_one(query, {'$set': {'count': redCount}})

    # Return nothing
    return ""

@app.put("/set-blue")
@cross_origin()
def set_blue_counter():
    '''
    Updates the blue counter value in the database.
    Request should contain a body with a 'blueCount' field that has
        the value to set the blue counter to.
    '''

    # Get the PUT request body and access the 'blueCount' field
    body = request.json
    blueCount = body['blueCount']

    # Update 1 document matching the query by setting the value of count
    query = {'name': 'blue'}
    db.counters.update_one(query, {'$set': {'count': blueCount}})

    # Return nothing
    return ""


if __name__ == "__main__":
    app.run()