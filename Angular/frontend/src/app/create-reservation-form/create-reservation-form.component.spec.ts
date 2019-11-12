import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReservationFormComponent } from './create-reservation-form.component';

describe('CreateReservationFormComponent', () => {
  let component: CreateReservationFormComponent;
  let fixture: ComponentFixture<CreateReservationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReservationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
