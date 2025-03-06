import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationToolbarComponent } from './navigation-toolbar.component';

describe('NavigationToolbarComponent', () => {
  let component: NavigationToolbarComponent;
  let fixture: ComponentFixture<NavigationToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationToolbarComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
