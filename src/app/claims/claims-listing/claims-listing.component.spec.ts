import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsListingComponent } from './claims-listing.component';

describe('ClaimsListingComponent', () => {
  let component: ClaimsListingComponent;
  let fixture: ComponentFixture<ClaimsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
