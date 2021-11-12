import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsTagComponent } from './claims-tag.component';

describe('ClaimsTagComponent', () => {
  let component: ClaimsTagComponent;
  let fixture: ComponentFixture<ClaimsTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
