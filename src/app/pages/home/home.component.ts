import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Candidate, CandidatesService} from "../../services/candidates.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ExcelService} from "../../services/excel.service";

export interface DownloadData{
  'ФИО': string;
  'Дата рождения': string;
  'Место рождения': string;
  'Паспортные данные': string;
  'Должность': string;
  'Подразделение': string;
  'Дата начала проверки': string;
  'Дата окончания проверки': string;
  'Результат': string;
  'Проверка пройдена': string;
  'Комментарий СБ': string;
  'Окончательный итог': string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //@ts-ignore
  @ViewChild('idRef') idRef: ElementRef
  //@ts-ignore
  form: FormGroup
  displayFilter: boolean = false
  currentPg: any
  candidateFilter: any = {}

  constructor(
    public authService: AuthService,
    public candidateService: CandidatesService,
    public modalService: NgbModal,
    public cookie: CookieService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.candidateService.reloadCand()

    this.form = new FormGroup({
      fio: new FormControl(null, Validators.required),
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
  }

  onQChanged($event: Event) {
    //@ts-ignore
    const selectedFile = $event.target.files[0]
    //@ts-ignore
    const id = $event.target.id.substr(1)
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name)
    uploadData.append('username', this.cookie.get('username'))
    this.candidateService.http.post(`http://questapi.vybor.local/candidates/addquest/${id}`, uploadData)
      .subscribe(response => {
          this.candidateService.reloadCand()
        }
      );
  }

  onWChanged($event: Event) {
    //@ts-ignore
    const selectedFile = $event.target.files[0]
    //@ts-ignore
    const id = $event.target.id.substr(1)
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name)
    uploadData.append('username', this.cookie.get('username'))
    this.candidateService.http.post(`http://questapi.vybor.local/candidates/addworkbook/${id}`, uploadData)
      .subscribe(response => {
          this.candidateService.reloadCand()
        }
      );
  }

  addCandidate() {
    const formData = <Candidate>{...this.form.value}
    this.candidateService.http.post(`http://questapi.vybor.local/candidates/add`, {
      username: this.cookie.get('username'),
      fio: formData.fio,
      birthday: formData.birthday,
      birthplace: formData.birthplace,
      passport: formData.passport,
      position: formData.position,
      department: formData.department,
    }).subscribe(
      () => {
        this.form.reset()
        this.candidateService.reloadCand()
      }
    )
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {backdropClass: 'light-dark-backdrop', size: 'xl'})
  }

  deleteQuest($event: Event) {
    //@ts-ignore
    let id = $event.target.id.substr(2)
    this.candidateService.http.delete(`http://questapi.vybor.local/candidates/deletequest/${id}`,{body:{username:this.cookie.get('username')}})
      .subscribe(
        response => {
          this.candidateService.reloadCand()
        }
      )
  }

  deleteWorkbook($event: Event) {
    //@ts-ignore
    let id = $event.target.id.substr(2)
    this.candidateService.http.delete(`http://questapi.vybor.local/candidates/deleteworkbook/${id}`, {body:{username:this.cookie.get('username')}})
      .subscribe(
        response => {
          this.candidateService.reloadCand()
        }
      )
  }

  saveToExcel() {
    let data = <any>[]
    this.candidateService.candidates.forEach( value => {
      let cand = <DownloadData>{}
      cand.ФИО = value.fio
      cand["Дата рождения"] = new Date(value.birthday).toLocaleDateString('ru')
      cand["Место рождения"] = value.birthplace
      cand["Паспортные данные"] = value.passport
      cand.Должность = value.position
      cand.Подразделение = value.department
      cand["Дата начала проверки"] = new Date(value.checkStartDate).toLocaleDateString('ru')
      cand["Дата окончания проверки"] = new Date(value.checkEndDate).toLocaleDateString('ru')
      cand.Результат = value.checkResult
      cand["Проверка пройдена"] = value.checkStatus === false ? 'ЛОЖЬ' : 'ИСТИНА'
      cand["Комментарий СБ"] = value.checkComment
      cand["Окончательный итог"] = value.endResult

      data.push(cand)
    })
    this.excelService.exportAsExcelFile(data, 'save_data');
  }

}
