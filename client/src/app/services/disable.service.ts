import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisableService {
  private realValueSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public real$: Observable<any> = this.realValueSubject.asObservable();
m:any;
  data: any;
  filterdata: any;
  paramsid: any;
  videobull: any;
  imgval: any;
  imgsrc: string
  videosrc: string
  belalertdata: any;
  relaler: any;
  anadata: any;
  pcval: any;
  pcv: any;
  pcplay: any;
  pcimage: any;
  constructor() {
    //this.realValueSubject.next(value);
  }
   

  updateRealValue(value: any): void {
    this.realValueSubject.next(value);
    this.m=value
  }
  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
  // data(any){
  //   const t='true'
  //   const l=this.m
  //   return l
  // }
  videoenble(bool:any){
    this.videobull=bool
  }
  sendbool(){
    return this.videobull
  }
  ////
  imgphotorecvid(imgv:any){
    this.imgval=imgv
  }
  sendimgbool(){
    return this.imgval
  }
  setImgsrc(imgsrc: string){
    this.imgsrc = imgsrc
  }
  sendimgsrc(){
    return this.imgsrc
  }
  setVideosrc(videosrc: string){
    this.videosrc = videosrc
  }
  sendVideosrc(){
    return this.videosrc
  }
  onProcessSubmitdata(data:any){
    this.realValueSubject.next(data)
  }
  senddatatosummer(){
    return this.filterdata;
  }
  //***** */
  paramesiddata(data:any){
    this.paramsid=data
  }
  sendparamsid(){
    return this.paramsid
  }

  alertdata(data:any){
    this.belalertdata=data
  }
  sendalertdata(){
    return this.belalertdata
  }
  relation(dataR:any){
this.relaler=dataR
  }
  realse(){
    return this.relaler
  }
  analiticdata(anunicdata){
    this.anadata=anunicdata
  }
  retuanadata(){
    return this.anadata
  }
  pcgetvalue(t){
    this.pcval=t
  }
  returnpc(){
    return this.pcval
  }
  pcvide(visable){
    this.pcv= visable
  }
  returnpcv(){
    return this.pcv
  }
  pcvideoplay(d){
    this.pcplay=d
  }
  retupcplat(){
    return this.pcplay
  }
  pcimg(im){
    this.pcimage=im
  }
  retunpcing(){
    return this.pcimage
  }

}