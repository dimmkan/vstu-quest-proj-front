import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface Candidate {
  id: number;
  fio: string;
  birthday: Date;
  birthplace: string;
  passport: string;
  position: string;
  department: string;
  checkStartDate: Date;
  checkEndDate: Date;
  checkResult: string;
  checkStatus: boolean;
  checkComment: string;
  questionnariesName: string;
  workbookName: string;
  endResult: string;
}

@Injectable({
  providedIn: 'root'
})

export class CandidatesService {

  candidates: Candidate[] = []

  constructor(public http: HttpClient) {
    this.reloadCand()
  }


  getById(id: number) {
    return this.candidates.find(
      p => p.id == id
    )
  }

  reloadCand() {
    this.http.get<Candidate[]>('http://questapi.vybor.local/candidates')
      .subscribe(response => {
        this.candidates = response
      })
  }
}
