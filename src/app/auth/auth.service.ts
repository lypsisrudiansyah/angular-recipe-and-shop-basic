import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSUKHSdPsNGxtkcY3PN7A1qR6o8AgPOz8',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn );
      }));
    }

    login(email: string, password: string) {
      return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSUKHSdPsNGxtkcY3PN7A1qR6o8AgPOz8',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
        ).pipe(catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn );
        }));
      }

      autoLogin() {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        // token from getter
        if (loadedUser.token) {
          this.user.next(loadedUser);
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.autoLogout(expirationDuration);
        }
      }

      logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
      }

      autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, expirationDuration);
      }

      private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
      ) {
          // What is It U Have To Know it +res
          // const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
          const user = new User(email, userId, token, expirationDate);
          this.user.next(user);
          this.autoLogout(expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        }

          private handleError(errorRes: HttpErrorResponse) {
            let errorMessage = 'An Unknown error Occured';
            if (!errorRes.error || !errorRes.error.error) {
              return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
              case 'EMAIL_EXISTS':
              errorMessage = 'This Email Already Exists';
              break;
              case 'EMAIL_NOT_FOUND':
              errorMessage = 'This Account Doesn\'t exists ';
              break;
              case 'INVALID_PASSWORD':
              errorMessage = 'This password not correct';
              break;
              case 'INVALID_EMAIL':
              errorMessage = 'This Email not Correct, Please Check Again';
              break;
              case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorMessage = 'Too Many Attemps, You Have Try again Later';
              break;
            }
            return throwError(errorMessage);
          }
        }
