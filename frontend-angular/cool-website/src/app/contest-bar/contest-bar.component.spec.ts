import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestBarComponent } from './contest-bar.component';

describe('ContestBarComponent', () => {
  let component: ContestBarComponent;
  let fixture: ComponentFixture<ContestBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
