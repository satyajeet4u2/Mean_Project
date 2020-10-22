import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthDataModel} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListner = new Subject<boolean>();
  private userId: string;

  constructor(private http: HttpClient,
              private  router: Router) {
  }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  addUser(email: string, password: string) {
    const authData: AuthDataModel = {email: email, password: password};
    // return
    this.http.post(environment.API_URL  + '/user/signup', authData)
      .subscribe(res => {
          this.router.navigate(['/']);
          console.log(res);
        }, error => {
          this.authStatusListner.next(false);
          console.log(error);
          console.log(error.error.error.message);
          console.log(error.error.error.errors.email.name);
        }
      );
  }

  loginUser(email: string, password: string) {
    const authData: AuthDataModel = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>(environment.API_URL  + '/user/login', authData)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.userId = res.userId;
          const expireInTimer = res.expiresIn;
          this.setAuthTimer(expireInTimer);
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireInTimer * 10000);
          this.saveAuthData(token, expirationDate, this.userId);
          console.log(expirationDate);
          this.router.navigate(['/']);
          console.log(this.token);
          console.log('res', res);
        }
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log('expireInTimer', expireIn);
    if (expireIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.authStatusListner.next(false);
    this.userId = null;
    this.router.navigate(['/']);
    this.clearAuthData();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
