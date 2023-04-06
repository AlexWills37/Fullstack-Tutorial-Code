import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contest-item',
  templateUrl: './contest-item.component.html',
  styleUrls: ['./contest-item.component.css']
})
export class ContestItemComponent implements OnInit {

  // Allow the parent component to sync a count variable
  @Input()
  count: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
