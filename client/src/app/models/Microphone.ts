export interface Microphone{
    id?: string;
    name?: string;
    rtsp_in?: string;
    rtsp_out?: string;
    heatmap_pic?:string;
    pic_height?:string;
    pic_width?:string;
    cam_height?:number;
    cam_width?:number;
    stored_vid?:string;
    atributes?:{
      longitude:string;
      latitude:string;
    };
    type?:string;
    http_in?:string;
  }
  