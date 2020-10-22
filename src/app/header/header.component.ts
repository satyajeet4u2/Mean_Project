import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;
 private authListnerSubscription: Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authListnerSubscription = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    this.authListnerSubscription.unsubscribe();
  }


}
