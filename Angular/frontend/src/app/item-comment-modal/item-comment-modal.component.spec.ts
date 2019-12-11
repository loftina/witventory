import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCommentModalComponent } from './item-comment-modal.component';

describe('ItemCommentModalComponent', () => {
  let component: ItemCommentModalComponent;
  let fixture: ComponentFixture<ItemCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
