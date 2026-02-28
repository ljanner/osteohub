/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiThemeService } from '@siemens/element-ng/theme';
import { vi } from 'vitest';

import { AppComponent } from './app';

const mockThemeService = {
  applyThemeType: vi.fn(),
  resolvedColorScheme: 'light' as 'light' | 'dark',
  themeIcons: vi.fn().mockReturnValue({}),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const createComponent = () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    mockThemeService.applyThemeType.mockClear();
    mockThemeService.resolvedColorScheme = 'light';

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: SiThemeService, useValue: mockThemeService }],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should apply auto theme on creation', () => {
      createComponent();
      expect(mockThemeService.applyThemeType).toHaveBeenCalledWith('auto');
    });

    it('should set darkTheme to false when resolved scheme is light', () => {
      mockThemeService.resolvedColorScheme = 'light';
      createComponent();
      expect(component['darkTheme']()).toBe(false);
    });

    it('should set darkTheme to true when resolved scheme is dark', () => {
      mockThemeService.resolvedColorScheme = 'dark';
      createComponent();
      expect(component['darkTheme']()).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should switch from light to dark', () => {
      createComponent();
      expect(component['darkTheme']()).toBe(false);

      component.toggleTheme();

      expect(component['darkTheme']()).toBe(true);
      expect(mockThemeService.applyThemeType).toHaveBeenCalledWith('dark');
    });

    it('should switch from dark to light', () => {
      mockThemeService.resolvedColorScheme = 'dark';
      createComponent();
      expect(component['darkTheme']()).toBe(true);

      component.toggleTheme();

      expect(component['darkTheme']()).toBe(false);
      expect(mockThemeService.applyThemeType).toHaveBeenCalledWith('light');
    });

    it('should toggle back and forth', () => {
      createComponent();

      component.toggleTheme();
      expect(component['darkTheme']()).toBe(true);

      component.toggleTheme();
      expect(component['darkTheme']()).toBe(false);
      expect(mockThemeService.applyThemeType).toHaveBeenCalledWith('light');
    });
  });
});
