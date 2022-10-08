import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

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

  login(){
    this.http.post('http://questapi.vybor.local/users/auth',{
      login: this.userLogin,
      password: this.userPw
    })
      .subscribe(response =>{
        //@ts-ignore
        this._isAuth = response.isAuth
        if(this._isAuth){
          let date = new Date();
          date.setHours(date.getHours() + 2)
          this.cookie.set('isAuth','true',{expires: date})
          //@ts-ignore
          this.cookie.set('roles',response.roles,{expires: date})
          this.cookie.set('username', this.userLogin,{expires: date})
          //@ts-ignore
          this.cookie.set('userId', response.userId,{expires: date})
        }else{
          this.isError = true
        }
      })

  }

  logout(){
    this._isAuth = false
    this.isError = false
    this.cookie.deleteAll()
    this.router.navigate(['/'])
  }

  isAuthenticated() {
    return this._isAuth
  }

  isErrored(){
    return this.isError
  }
}
