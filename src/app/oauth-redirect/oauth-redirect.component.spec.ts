import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, CommonService } from '../shared/services';
import { OauthRedirectComponent } from './oauth-redirect.component';
import { Router } from '@angular/router';

describe('OauthRedirectComponent', () => {
  let component: OauthRedirectComponent;
  let fixture: ComponentFixture<OauthRedirectComponent>;
  let mockAuthService: any = {
    getUserAccess: () => {
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
  let mockCommonService: any = {
    initiateStatusModal: () => {
      return true
    },
    validateAPIResponse: () => {
      return true
    }
  };
  const RouterSpy = jasmine.createSpyObj(
    'Router',
    ['navigate']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        // RouterTestingModule.withRoutes([]), 
        { provide: AuthService, useValue: mockAuthService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: Router, useValue: RouterSpy }
        ],
      declarations: [OauthRedirectComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
