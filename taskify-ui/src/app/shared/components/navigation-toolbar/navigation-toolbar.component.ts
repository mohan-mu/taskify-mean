import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AUTH_KEY } from '../../constants/constants';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrl: './navigation-toolbar.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NavigationToolbarComponent {
  readonly sideNavItems: { title: string; param: any }[] = [
    { title: "Today's Tasks", param: { dueDate: new Date().toISOString().slice(0,10)}  },
    { title: 'All Tasks', param: {} },
    { title: 'Important Tasks', param: { priority: 'High' } },
    { title: 'Completed Tasks', param: { status: 'Completed' } },
    { title: 'Pending Tasks', param: { status: 'Pending' } },
  ];
  private _breakpointObserver = inject(BreakpointObserver);

  private _router = inject(Router);
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout() {
    localStorage.removeItem(AUTH_KEY);
    this._router.navigate(['auth/signin']);
  }
}
