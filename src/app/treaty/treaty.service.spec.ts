import { TestBed } from '@angular/core/testing';
import { HttpService } from '../shared/services';
import { TreatyService } from './treaty.service';

describe('TreatyService', () => {
  let service: TreatyService;
  let mockHttpService: any = {
    GET: () => true,
    PUT: () => true,
    POST: () => true,
    DELETE: () => true,
    getAuthenticatedUser: () => {
      return { user: 'bob', idToken: 'token' }
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpService, useValue: mockHttpService }],
    });
    service = TestBed.inject(TreatyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
