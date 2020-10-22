import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
// import {Observable} from 'rxjs';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ErrorComponent} from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private  dialog: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // alert(req);
    console.log(req);
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An Unkown error from Interceptor';
        if (error.error.error.message) {
          errorMessage = error.error.error.message;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
        console.log(error);
        console.log(error.error.message);

        // alert(error.error.message);
        // alert(error.error.error.message);
        this.dialog.open(ErrorComponent, {
          data: {
            message: errorMessage,
            err: error
          }
        });
        return throwError(error);
      })
    );
  }
}
