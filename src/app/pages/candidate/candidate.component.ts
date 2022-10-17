import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Candidate, CandidatesService} from "../../services/candidates.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {

  //@ts-ignore
  candidate: Candidate
  //@ts-ignore
  form: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public candidateService: CandidatesService,
    public modalService: NgbModal,
    public cookie: CookieService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      //@ts-ignore
      this.candidate = this.candidateService.getById(+params.id)
    })

    this.form = new FormGroup({
      fio: new FormControl('', Validators.required),
      birthday: new FormControl(new Date()),
      birthplace: new FormControl(''),
      passport: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      checkStartDate: new FormControl(new Date()),
      checkEndDate: new FormControl(new Date()),
      checkResult: new FormControl(''),
      checkStatus: new FormControl(''),
      checkComment: new FormControl(''),
      endResult: new FormControl('')
    })

    if(this.cookie.get('roles') === 'user' || this.cookie.get('roles') === 'kadry'){
      this.form.controls.checkStatus.disable()
    }
  }

  deleteCandidate() {
    this.route.params.subscribe((params: Params) => {
      this.candidateService.http.delete(`${environment.api_url}/candidates/delete/${params.id}`,{body:{username:this.cookie.get('username')}})
        .subscribe(
          () => {
            this.candidateService.candidates = this.candidateService.candidates.filter(p => p.id != +params.id)
            this.router.navigate(['/'])
          }
        )
    })
  }

  updateCandidate() {
    this.route.params.subscribe((params: Params) => {
      this.candidateService.http.put(`${environment.api_url}/candidates/update/${params.id}`, {
        username: this.cookie.get('username'),
        id: params.id.toString(),
        fio: this.candidate.fio,
        birthday: this.candidate.birthday,
        birthplace: this.candidate.birthplace,
        passport: this.candidate.passport,
        position: this.candidate.position,
        department: this.candidate.department,
        checkStartDate: this.candidate.checkStartDate,
        checkEndDate: this.candidate.checkEndDate,
        checkResult: this.candidate.checkResult,
        checkStatus: this.candidate.checkStatus,
        checkComment: this.candidate.checkComment,
        endResult: this.candidate.endResult,
      }).subscribe(
        () => {
          this.router.navigate(['/'])
        }
      )
    })
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {backdropClass: 'light-dark-backdrop', size: 'xl'});
  }

}
