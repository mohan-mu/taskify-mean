import { ComponentFixture, TestBed } from '@angular/core/testing';
import NavigationToolbarComponent from './navigation-toolbar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationToolbarComponent', () => {
  let component: NavigationToolbarComponent;
  let fixture: ComponentFixture<NavigationToolbarComponent>;
  let breakpointObserver: BreakpointObserver;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationToolbarComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () => of({ matches: true }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationToolbarComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.inject(BreakpointObserver);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sideNavItems defined', () => {
    expect(component.sideNavItems.length).toBeGreaterThan(0);
  });

  it('should set isHandset$ observable', done => {
    component.isHandset$.subscribe(isHandset => {
      expect(isHandset).toBe(true);
      done();
    });
  });

  it('should navigate to signin on logout', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.logout();
    expect(navigateSpy).toHaveBeenCalledWith(['auth/signin']);
  });

  it('should remove AUTH_KEY from localStorage on logout', () => {
    localStorage.setItem('AUTH_KEY', 'test');
    component.logout();
    expect(localStorage.getItem('AUTH_KEY')).toBeNull();
  });
});
