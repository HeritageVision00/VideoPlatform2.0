exports.dashgenerate = function (array,num) {
    // for( let d of array){}
  let diff1=num;
        //console.log(this.supperend,diff1,this.sedata,'datesuperes',this.supperstart)
        
        let range , start, end, graphrange
  if(diff1 ==  60){
      // range=30 * 60 * 1000 
      range=10* 60 * 1000 
      graphrange=10
      end =  new Date()
      start=new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 1, 0, 0);
      }
      if(diff1 == 720){
        range = 60*60*1000
        graphrange=60
        start =  new Date()// this.supperstart
      start=new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      end =  new Date()
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 12, 0, 0);
      }else if(diff1 == 7*24*60){
        range = 24*60* 60 * 1000
        graphrange=24*60
        start = new Date()// this.supperstart 1 week
      start=new Date(start.getFullYear(), start.getMonth(), start.getDate()-7, 0, 0, 0);
      end =  new Date()
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 50);
      }else if(diff1  == 480){
        range = 45* 60 * 1000
        graphrange=45
        start = start = new Date()// this.supperstart
      start=new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      end =  new Date()
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 8, 0, 0);
      }else if(diff1  == 30*24*60 ){
        range = 3*24*60 * 60 * 1000
        graphrange=8460
        end =  new Date()
        start = start = new Date(this.supperstart)// this.supperstart 1 one month
      start=new Date(end.getFullYear(), end.getMonth()-1, end.getDate(), 0, 0, 0);
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
       console.log(start,'month',end,'tttttt11111111111113s',start-end)
      } 
      else if(diff1  == 24*60 ){
        range = 3*60 * 60 * 1000
        graphrange=3*60
        end =  new Date()
        //start = new Date(this.supperstart)// this.supperstart
      start=new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
      //end =  new Date(this.supperstart)
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 58);
        
      } 
      else if(diff1  == 12*30*24*60 ){
        range = 30*24*60 * 60 * 1000
        graphrange=43200
        end =  new Date()
        //start = start = new Date(this.supperstart)// this.supperstart 1 one year
      start=new Date(end.getFullYear()-1, end.getMonth(), end.getDate(), 0, 0, 0);
        end= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
        //console.log(start,'love',end,'tttttt11111111111113s')
      } 
  var ress = {}
  var analytictype;
    let cache= new Date(start).getTime();
        for (var v of array){
          analytictype=v.type
          if (
            cache < new Date(v.createdAt).getTime()
             
          ) {
            //console.log(cache,v.createdAt.getTime(),'ssssssssssss3')
            while (
              cache < new Date(v.createdAt).getTime()
            ) {
              cache = new Date(cache)
              ress[cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
              cache = cache.getTime()
              cache += range
            }
          }
          if (
            cache >= new Date(v.createdAt).getTime()
          ) {
            let t = cache
            t -= range
            t = new Date(t)
            ress[t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()] = (ress[ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1 
          }
  
        }
        while (
          cache <= new Date(end)
        ) {
          cache = new Date(cache)
          ress[cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0 
          cache = cache.getTime()
          cache += range
        }
        let a=[ress,analytictype]
        return {
          ress: a,
          array: array
      }
      }