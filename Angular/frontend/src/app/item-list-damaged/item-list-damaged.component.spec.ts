import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListDamagedComponent } from './item-list-damaged.component';

describe('ItemListDamagedComponent', () => {
  let component: ItemListDamagedComponent;
  let fixture: ComponentFixture<ItemListDamagedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListDamagedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListDamagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
