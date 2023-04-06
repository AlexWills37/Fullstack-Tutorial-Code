import { Injectable } from '@angular/core';

/**
 * Angular service to access the Flask server and connect to our database!
 *
 * USAGE:
 *    - Import and inject this service into an angular component
 *        - (in the constructor's parameters, write "private <variable name>: DatabaseService")
 *    - Call one of the database methods
 *    - If you are using getRedCount() or getBlueCount(), the method will return a Promise<any>
 *        - After calling the method, put:
 *            .then( (response) => response.json() ).then( (data) => {
 *              <any code you want to call with the json response>
 *            });
 *
 *          - The first .then takes the <any> value from the promise (called response here) and returns the json value (another promise)
 *          - The second .then takes the json respones and does whatever you would like to do with the response (now named data)
 *
 * Information about fetch(), used in this service: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * @author Alex Wills
 * @date April 4, 2023
 */


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private backendEndpoint = ''   // endpoint hosted with EC2, running the flask server
  // private backendEndpoint = 'http://127.0.0.1:5000'  // endpoint when running flask locally


  constructor() { }

  /**
   * Obtains the red counter's value from the database.
   * @returns the Flask server's response to the get-red route
   */
  getRedCount(): Promise<any> {

    // Send a GET request to endpoint/get-red and return the response
    return fetch(this.backendEndpoint + "/get-red", {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*' }
      });
  }

  /**
   * Obtains the blue counter's value from the database.
   * @returns the Flask server's responsse to the get-blue route
   */
  getBlueCount(): Promise<any> {

    // Send a GET request to endpoint/get-blue and return the response
    return fetch(this.backendEndpoint + "/get-blue", {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*' }
      });
  }

  /**
   * Sends the new count for the red score to the Flask server's set-red route.
   * @param count the new value of the red counter
   */
  setRedCount(count: number): void {

    // Create the body of the PUT request
    const body = {
      redCount: count
    };

    // Send a PUT request to endpoint/set-red
    fetch(this.backendEndpoint + "/set-red", {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*' },
      body: JSON.stringify(body)
    });
  }

  /**
   * Sends the new count for the blue score to the Flask server's set-blue route.
   * @param count the new value of the blue counter
   */
  setBlueCount(count: number): void {

    // Create the body of the PUT request
    const body = {
      blueCount: count
    };

    // Send a PUT request to endpoint/set-red
    fetch(this.backendEndpoint + "/set-blue", {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*' },
      body: JSON.stringify(body)
    });
  }

}
