import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  set isAuth(value: boolean) {
    this._isAuth = value;
  }
  private _isAuth = false
  private isError = false
  userLogin = ''
  userPw = ''

  constructor(
    private cookie: CookieService,
    private router: Router,
    public http: HttpClient
  ) {
  }

  login() {
      this.http.post(`${environment.api_url}/auth/login`, {
        login: this.userLogin,
        password: this.userPw
      })
        .subscribe((response: any) => {
          if (response.access_token) {
            const token_chunks = response.access_token.split('.');
            const paramsObj = JSON.parse(atob(token_chunks[1]));        
            //@ts-ignore
            this._isAuth = paramsObj.isAuth
            if (this._isAuth) {
              let date = new Date();
              date.setHours(date.getHours() + 2)
              this.cookie.set('isAuth', 'true', { expires: date })
              //@ts-ignore
              this.cookie.set('roles', paramsObj.roles, { expires: date })
              this.cookie.set('username', this.userLogin, { expires: date })
              //@ts-ignore
              this.cookie.set('userId', paramsObj.userId, { expires: date })
            } else {
              this.isError = true
            }
          } else {
            this.isError = true
          }
        }, (error) => {
          if (error) {
            this.isError = true
            console.log(error);
          }
        })
  }

  logout() {
    this._isAuth = false
    this.isError = false
    this.cookie.deleteAll()
    this.router.navigate(['/'])
  }

  isAuthenticated() {
    return this._isAuth
  }

  isErrored() {
    return this.isError
  }
}
