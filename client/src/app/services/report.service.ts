import { Injectable } from '@angular/core';
import { utils, writeFileXLSX } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { api } from '../models/API';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private serv: AnalyticsService,
    private datepipe: DatePipe,
  ) { }

  async csv (range,algo, now_user, algo_id, cameraId, timezone){
    return new Promise (async (resolve, reject) => {
      let type;
      if(now_user.id_branch != '0000'){
        type = 'cam_id';
      }else{
        type = 'id_account'
      }
      let l = {
        start: range.start,
        end: range.end,
        type: type,
        ham: false,
        algo: algo
      }
      ;(await this.serv.report1(algo_id, cameraId, l)).subscribe(
        async (res) => {
          let data: Array<any>;
          data = res['data']
          for (let m of data) {
            let fold
            if(algo_id === -1){
              fold = m['type']
            }else{
              fold = algo
            }
            m['picture'] = 'http://localhost' + api + '/pictures/' + m['id_account'] + '/' + m['id_branch'] + '/'+ fold +'/' + m['cam_id'] + '/' + m['picture']
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', timezone);
          }
          try{
            const ws = utils.json_to_sheet(data);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Data");
            await writeFileXLSX(wb, `${uuidv4()}.xlsx`);
            resolve({ success: true }) 
          }catch(err){
            console.error(err)
            reject({ success: false })
          }
        },
        err => {
          console.error(err)
          reject( { error: true })
        }
      )
    })
  }
}