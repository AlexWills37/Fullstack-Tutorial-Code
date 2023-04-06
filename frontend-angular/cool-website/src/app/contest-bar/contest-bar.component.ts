import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service'

@Component({
  selector: 'app-contest-bar',
  templateUrl: './contest-bar.component.html',
  styleUrls: ['./contest-bar.component.css']
})
export class ContestBarComponent implements OnInit {

  redPercent: number = 50;  // How much of the width belongs to the red bar
  redCount: number = 0;     // The number of votes for the red bar
  bluePercent: number = 50; // How much of the width belongs to the blue bar
  blueCount: number = 0;    // The number of votes for the blue bar


  // Inject the DatabaseService with a variable named 'database'
  constructor(private database: DatabaseService) { }

  ngOnInit(): void {

    // Set the redCount variable with what is stored in the database
    this.database.getRedCount().then(
      (response) => response.json()
    ).then(
      (data) => {
        this.redCount = data['count'];
        this.updatePoll();
      }
    );

    // Set the blueCount variable with what is stored in the database
    this.database.getBlueCount().then(
      (response) => response.json()
    ).then(
      (data) => {
        this.blueCount = data['count'];
        this.updatePoll();
      }
    );

  }

  /**
   * Saves the current values of the red and blue counter with the database service.
   */
  savePoll(): void {
    this.database.setBlueCount(this.blueCount);
    this.database.setRedCount(this.redCount);
  }


  /**
   * Increase the red side's count and update the percentages.
   */
  clickRed(){
    this.redCount++;
    this.updatePoll();
  }

  /**
   * Increase the blue side's count and update the percentages.
   */
  clickBlue(){
    this.blueCount++;
    this.updatePoll();
  }

  /**
   * Updates the redPercent and bluePercent properties to reflect their new count values.
   * This function should be called whenever the counters are changed.
   */
  updatePoll(){
    var total = this.redCount + this.blueCount;
    this.redPercent = 100 * this.redCount / total;
    this.bluePercent = 100 * this.blueCount / total;
  }
}
