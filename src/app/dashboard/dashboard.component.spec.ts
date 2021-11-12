import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService, CommonService } from '../shared/services';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: any = {
    getUserData: () => {
      return {
          "userCategoryId": 1,
          "userCategory": "User Admin",
          "accessDetails": {
            "Policy Data": "Read-Only",
            "User Profile": "Edit",
            "Claims Tagging": "Edit",
            "Reinsurance/Treaty Code Maintenance": "Edit"
          }
        };
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }, CommonService],
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
