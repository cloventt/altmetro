import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusTileComponent } from './add-bus-tile.component';

describe('AddBusTileComponent', () => {
  let component: AddBusTileComponent;
  let fixture: ComponentFixture<AddBusTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
