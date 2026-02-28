import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { vi } from 'vitest';

import { environment } from '../../environments/environment';
import { credentialsInterceptor } from '../interceptors/credentials.interceptor';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let toastService: { showToastNotification: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    toastService = { showToastNotification: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
        AuthService,
        { provide: SiToastNotificationService, useValue: toastService },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be logged in by default', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should have empty userName', () => {
      expect(service.userName()).toBe('');
    });

    it('should have empty userEmail', () => {
      expect(service.userEmail()).toBe('');
    });

    it('should have empty userPicture', () => {
      expect(service.userPicture()).toBe('');
    });
  });

  describe('checkAuth', () => {
    it('should set user data on successful response', async () => {
      const promise = service.checkAuth();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`);
      expect(req.request.withCredentials).toBe(true);
      req.flush({
        sub: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
      });

      await promise;

      expect(service.isLoggedIn()).toBe(true);
      expect(service.userName()).toBe('Test User');
      expect(service.userEmail()).toBe('test@example.com');
      expect(service.userPicture()).toBe('https://example.com/pic.jpg');
    });

    it('should not be logged in on 401 response', async () => {
      const promise = service.checkAuth();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      await promise;

      expect(service.isLoggedIn()).toBe(false);
    });

    it('should clear previous user data on error', async () => {
      const check1 = service.checkAuth();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({
        sub: 'test@example.com',
        name: 'Test',
        picture: 'pic.jpg',
      });
      await check1;
      expect(service.isLoggedIn()).toBe(true);

      const check2 = service.checkAuth();
      httpMock
        .expectOne(`${environment.apiBaseUrl}/auth/me`)
        .flush(null, { status: 401, statusText: 'Unauthorized' });
      await check2;

      expect(service.isLoggedIn()).toBe(false);
      expect(service.userName()).toBe('');
    });
  });

  describe('logout', () => {
    it('should clear logged in state', async () => {
      const check = service.checkAuth();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({
        sub: 'test@example.com',
        name: 'Test',
        picture: 'pic.jpg',
      });
      await check;
      expect(service.isLoggedIn()).toBe(true);

      const logoutPromise = service.logout();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`).flush({ success: true });
      await logoutPromise;

      expect(service.isLoggedIn()).toBe(false);
    });

    it('should reset user data', async () => {
      const check = service.checkAuth();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({
        sub: 'test@example.com',
        name: 'Test User',
        picture: 'pic.jpg',
      });
      await check;

      const logoutPromise = service.logout();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`).flush({ success: true });
      await logoutPromise;

      expect(service.userName()).toBe('');
      expect(service.userEmail()).toBe('');
      expect(service.userPicture()).toBe('');
    });

    it('should show a toast notification', async () => {
      const logoutPromise = service.logout();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`).flush({ success: true });
      await logoutPromise;

      expect(toastService.showToastNotification).toHaveBeenCalledWith({
        state: 'success',
        title: 'Abgemeldet',
        message: 'Du wurdest erfolgreich abgemeldet.',
        timeout: 5000,
      });
    });

    it('should send request with credentials', async () => {
      const logoutPromise = service.logout();
      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`);
      expect(req.request.withCredentials).toBe(true);
      req.flush({ success: true });
      await logoutPromise;
    });

    it('should keep user logged in if logout request fails', async () => {
      const check = service.checkAuth();
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({
        sub: 'test@example.com',
        name: 'Test',
        picture: 'pic.jpg',
      });
      await check;

      const logoutPromise = service.logout();
      httpMock
        .expectOne(`${environment.apiBaseUrl}/auth/logout`)
        .flush(null, { status: 500, statusText: 'Error' });
      await logoutPromise;

      expect(service.isLoggedIn()).toBe(true);
    });
  });
});
