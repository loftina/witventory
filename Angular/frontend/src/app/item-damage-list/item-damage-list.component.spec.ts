import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDamageListComponent } from './item-damage-list.component';

describe('ItemDamageListComponent', () => {
  let component: ItemDamageListComponent;
  let fixture: ComponentFixture<ItemDamageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDamageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDamageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
