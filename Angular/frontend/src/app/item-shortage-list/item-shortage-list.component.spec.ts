import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemShortageListComponent } from './item-shortage-list.component';

describe('ItemShortageListComponent', () => {
  let component: ItemShortageListComponent;
  let fixture: ComponentFixture<ItemShortageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemShortageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemShortageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
