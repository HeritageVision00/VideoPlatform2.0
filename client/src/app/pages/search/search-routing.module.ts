import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { SearchComponent } from './search.component';
import { OtherGuard } from '../../guard/other.guard';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { BarComponent } from './bar/bar.component';
import { ListComponent } from './list/list.component';
import { SortComponent } from './sort/sort.component';

const routes: Routes = [
  {path: '',
  component: SearchComponent,
    children: [
      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [OtherGuard]
      },
      {
        path: 'order/:uuid/:ready',
        component: SortComponent,
        canActivate: [OtherGuard]
      },
      {
        path: 'bar',
        component: BarComponent,
        canActivate: [OtherGuard]
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [OtherGuard]
      },
      { path: '', 
      redirectTo: 'list',
      pathMatch: 'full',
      },
      {
      path: '**',
      component: PagenotfoundComponent
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
