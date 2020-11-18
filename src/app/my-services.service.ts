import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from './login-firebase/user-model';
// import { User } from './user';
interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MyServicesService {

  constructor(private http: HttpClient) { }
  user = new Subject<UserModel>();
  // With firebase

  signUp(email, password) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBOCnZEoWjRubdohlE122nW8P-uwsRSmo', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
      )
    }))
  }

  signIn(email, password) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBOCnZEoWjRubdohlE122nW8P-uwsRSmo', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError))
  }

  handleAuthentication(email, userId, token, expirationDate) {
    const sxpirationDate = new Date(new Date().getTime() + expirationDate * 1000);
    const user = new UserModel(
      email,
      userId,
      token,
      sxpirationDate
    )
    this.user.next(user);
  }
  private handleError(errRes: HttpErrorResponse) {
    let errMsg = "An unknown error occured"
    if (!errRes.error || !errRes.error.error) {
      return throwError(errMsg);
    }
    else {
      switch (errRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errMsg = "The email address is already in use by another account."
          break;
        case 'OPERATION_NOT_ALLOWED':
          errMsg = "Password sign-in is disabled for this project."
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errMsg = "We have blocked all requests from this device due to unusual activity. Try again later."
          break;
        case 'EMAIL_NOT_FOUND':
          errMsg = 'There is no user record corresponding to this identifier. The user may have been deleted.'
          break;
        case 'INVALID_PASSWORD':
          errMsg = 'The password is invalid or the user does not have a password.'
          break;
        case 'USER_DISABLED':
          errMsg = 'The user account has been disabled by an administrator.'
          break;
        default:
          errMsg = errRes.error.error.message;
      }
      return throwError(errMsg);
    }

  }












  loginuser(object) {
    return this.http.post<AuthResponseData>('https://console.asthma-action-hero.i22.biz/api/v1/user/login.json', object)
  }
  getData() {
    return this.http.get('https://simplelogin-3e4d5.firebaseio.com/myFile.json')
  }

  onSubmit(object) {
    return this.http.post('https://simplelogin-3e4d5.firebaseio.com/myFile.json', object)
  }
  getAllComents() {
    return this.http.get('https://jsonplaceholder.typicode.com/comments')

  }

}
