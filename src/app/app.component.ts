import {Component, TemplateRef} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Candidate} from "./services/candidates.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  form: FormGroup;
  form1: FormGroup;

  constructor(
    private cookieService: CookieService,
    public authService: AuthService,
    private modalService: NgbModal
  ) {
    this.authService.isAuth = this.cookieService.check('isAuth');
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
    this.form1 = new FormGroup(
      {newpass: new FormControl('', Validators.required)}
    )
  }

  getUsername(){
    return this.cookieService.get('username')
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {backdropClass: 'light-dark-backdrop', size: 'xl'})
  }

  refreshPass() {
    const formData = <any>{...this.form1.value}
    this.authService.http.post(`${environment.api_url}/users/refreshpass/${this.cookieService.get('userId')}`, {
      newpass: formData.newpass
    }).subscribe(() => {
          this.form1.reset()
        }
      );
  }
}
