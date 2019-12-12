import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNoteListComponent } from './item-note-list.component';

describe('ItemNoteListComponent', () => {
  let component: ItemNoteListComponent;
  let fixture: ComponentFixture<ItemNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
