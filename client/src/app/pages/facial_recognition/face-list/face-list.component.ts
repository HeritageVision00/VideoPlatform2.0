import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { DeleteWinComponent } from '../../delete-win/delete-win.component';


@Component({
  selector: 'app-face-list',
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.css']
})
export class FaceListComponent implements OnInit {


    @HostBinding('class') classes ='row';
    users: Array<any> = [];
    images: any = [];
  relations: any;
    constructor(
      private facesService: FacesService,
      private router: Router,
      private windowService: NbWindowService,
      ) { }
        
    ngOnInit() {
      this.addSched();
      this.getUsers();
    }

    stat:string = 'success'
    
    settings = {
      mode: 'external',
      actions: {
        position: 'right',
        //custom: [{ name: 'routeToAPage', title: `<img src="/icon.png">` }]
        columnTitle: 'Edit / Delete',
      //   add: true,
      //   edit: true,
      //   delete: true,
      //   custom: [
      //   { name: 'viewrecord', title: '<button nbButton [status]="stat">aaaa<button>'},
      // ],
      },
      pager : {
        display : true,
        perPage:5
        },
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmCreate: true,
        },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      noDataMessage: "No users found",
      columns: {
        name: {
          title: 'Name',
          type: 'string',
          filter: false
        },
        gender: {
          title: 'Gender',
          filter: false,
          editor: {
            type: 'list',
            config: {
              selectText: 'Select:',
              list: [
                {value: 'Male', title:'Male'},
                {value: 'Female', title:'Female'}
              ],
            },
          }
        },
        age_group: {
          title: 'Age Group',
          type: 'string',
          filter: false
        },
        role: {
          title: 'Designation',
          type: 'string',
          filter: false
        },
        category: {
          title: 'Category',
          type: 'string',
          filter: false
        },
        images: {
          title: 'Images',
          type: 'custom',
          filter: false,
          renderComponent: ButtonViewComponent,
          onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
              alert(`${row.name} saved!`)
            });
          }
        }
      },
    };
    
    check(){
      this.show = false;
      if(this.searchStr != ''){
        this.search(this.searchStr)
      }
    }
  
    search(query: string){
      if(this.searchWr == ''){
        return this.show = true;
      }else{
        this.show = false;
      }
      this.source = this.source1.filter(data => data[this.searchWr].includes(query))
      if(query == ''){
        this.source = this.source1;
      }
    }

    source:any = new LocalDataSource();
    source1:any = new LocalDataSource();
    searchStr:string = ''
    searchFields = [
    {
      value: 'name',
      show: 'Name'
    },
    {
      value: 'gender',
      show: 'Gender'
    },
    {
      value: 'age_group',
      show: 'Age Group'
    },
    {
      value: 'role',
      show: 'Designation'
    },
    {
      value: 'category',
      show: 'Category'
    },
  ];
    searchWr:string = '';
    show:boolean = false;

    hola2():void{
      this.router.navigateByUrl('/pages/user/add')
    }

    hola1(event): void{
      console.log(event)
      this.router.navigateByUrl('/pages/user/edit/' + event.data.uuid)
    }
    
    hola3(event): void{
      this.deleteUser(event.data.uuid)
    }

    addSched(){
          this.facesService.getAllRelations().subscribe(
            res => {
              this.relations = res['data'];
              for(var a of this.relations){
                if(a.algo_id == 18){
                    this.settings.columns['sched'] =  {
                      title: 'Schedule',
                      type: 'custom',
                      filter: false,
                      renderComponent: Button1ViewComponent,
                      onComponentInitFunction(instance) {
                        instance.save.subscribe(row => {
                          alert(`${row.name} saved!`)
                        });
                      }
                    },
                    this.settings = Object.assign({}, this.settings);
                }
              }
            },
            err => console.error(err)
          );
    }

  getUsers(){
    this.facesService.getUsers().subscribe(
      res => {
        this.source = res['data'];
        this.users = res['data']
        this.source1 = this.source
      },
      err => console.error(err)
    );
  }

    deleteUser(id: string){
      for(var a in this.users){
        if(id == this.users[a].uuid){
          var n = this.users[a].name;
        }
      }
      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: false,
        close: true,
      }
      const windowRef = this.windowService.open(DeleteWinComponent, { title: `Do you want to delete ${n}'s Facial Recognition user?`, context: { type: 0, data: { id: id, name: n }}, buttons:  buttonsConfig, closeOnBackdropClick:true, closeOnEsc: true })
      windowRef.onClose.subscribe((data) => {
        if(data === true){
          this.getUsers();
        }
      });
  }

}

@Component({
  selector: 'button-view',
  template: `
    <button class='btn btn-primary btn-block' nbButton outline status="basic" (click)='onClick()'><i class="fas fa-images"></i></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(private router: Router){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.router.navigateByUrl('/pages/user/images/' + this.rowData.uuid)
  }
}

@Component({
  selector: 'button-view',
  template: `
    <button class='btn btn-primary btn-block' (click)='onClick1()'><i class="far fa-calendar-alt"></i></button>
  `,
})
export class Button1ViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(private router: Router){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick1() {
    this.router.navigateByUrl('/pages/user/schedule/' + this.rowData.uuid)
  }
}