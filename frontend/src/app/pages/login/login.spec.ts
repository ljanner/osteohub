import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: {
    loginWithGoogle: ReturnType<typeof vi.fn>;
    isLoggedIn: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const setupWithQueryParams = async (params: Record<string, string> = {}) => {
    authService = {
      loginWithGoogle: vi.fn(),
      isLoggedIn: vi.fn().mockReturnValue(false),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(params) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('without query params', () => {
    beforeEach(async () => await setupWithQueryParams());

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the login button', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
      expect(button).toBeTruthy();
      expect(button.textContent?.trim()).toBe('Mit Google anmelden');
    });

    it('should render the heading', () => {
      const heading: HTMLElement = fixture.nativeElement.querySelector('h2');
      expect(heading?.textContent?.trim()).toBe('OsteoHub Login');
    });

    it('should not show an error notification', () => {
      const notification = fixture.nativeElement.querySelector('si-inline-notification');
      expect(notification).toBeNull();
    });

    it('should not navigate anywhere', () => {
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call loginWithGoogle on button click', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
      button.click();
      expect(authService.loginWithGoogle).toHaveBeenCalled();
    });
  });

  describe('with error query param', () => {
    it('should show error for auth_denied', async () => {
      await setupWithQueryParams({ error: 'auth_denied' });
      fixture.detectChanges();
      const notification = fixture.nativeElement.querySelector('si-inline-notification');
      expect(notification).toBeTruthy();
    });

    it('should show error for token_exchange_failed', async () => {
      await setupWithQueryParams({ error: 'token_exchange_failed' });
      fixture.detectChanges();
      const notification = fixture.nativeElement.querySelector('si-inline-notification');
      expect(notification).toBeTruthy();
    });

    it('should show error for not_allowed', async () => {
      await setupWithQueryParams({ error: 'not_allowed' });
      fixture.detectChanges();
      const notification = fixture.nativeElement.querySelector('si-inline-notification');
      expect(notification).toBeTruthy();
    });

    it('should show error for unknown error', async () => {
      await setupWithQueryParams({ error: 'something_else' });
      fixture.detectChanges();
      const notification = fixture.nativeElement.querySelector('si-inline-notification');
      expect(notification).toBeTruthy();
    });

    it('should not navigate away on error', async () => {
      await setupWithQueryParams({ error: 'auth_denied' });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when already logged in', () => {
    it('should redirect to overview', async () => {
      authService = {
        loginWithGoogle: vi.fn(),
        isLoggedIn: vi.fn().mockReturnValue(true),
      };
      router = { navigate: vi.fn() };

      await TestBed.configureTestingModule({
        imports: [LoginComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: Router, useValue: router },
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/overview']);
    });
  });
});
