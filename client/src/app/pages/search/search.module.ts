import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search.component";
import { UploadComponent } from "./upload/upload.component";
import { BarComponent } from "./bar/bar.component";
import { FileUploadModule } from "ng2-file-upload";
import { Ng2SmartTableModule } from "ng2-smart-table"
import { DragDropModule } from "@angular/cdk/drag-drop";

import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbAccordionModule,
  NbButtonModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule,
  NbUserModule,
  NbActionsModule,
  NbCheckboxModule,
  NbRadioModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbSelectModule,
  NbSpinnerModule,
  NbContextMenuModule,
  NbPopoverModule,
  NbLayoutModule,
  NbMenuModule,
  NbWindowModule,
  NbDialogModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbAlertModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbChatModule,
  NbProgressBarModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListComponent } from "./list/list.component";
import { authInterceptorProviders } from "../../_helpers/auth.interceptor";
import { NgxSpinnerModule } from "ngx-spinner";
import {
  SetngsComponent,
  WindowResultService,
} from "./setngs/setngs.component";
import { CheckComponent } from "./check/check.component";
import { ViewChartComponent } from "./view-chart/view-chart.component";
import { ChartsModule } from "ng2-charts";
import { NgxHorizontalTimelineModule } from "ngx-horizontal-timeline";
import { SortAlphabetPipe } from "../../pipes/sort-alphabet.pipe";
import { SortComponent } from './sort/sort.component';
import { ResumeComponent } from './resume/resume.component';
import { AnalyticsVirgComponent } from './analytics-virg/analytics-virg.component';

@NgModule({
  declarations: [
    // SortAlphabetPipe,
    SearchComponent,
    UploadComponent,
    BarComponent,
    ListComponent,
    SetngsComponent,
    CheckComponent,
    ViewChartComponent,
    SortComponent,
    ResumeComponent,
    AnalyticsVirgComponent,
  ],
  imports: [
    DragDropModule,
    NbAlertModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbChatModule,
    NbCalendarKitModule,
    NbProgressBarModule,
    NbDialogModule.forChild(),
    NbTooltipModule,
    NbWindowModule.forChild(),
    NbMenuModule,
    NbTreeGridModule,
    NbRouteTabsetModule,
    NbTabsetModule,
    NbStepperModule,
    NbSelectModule,
    NbUserModule,
    NbContextMenuModule,
    NbLayoutModule,
    NbActionsModule,
    NbListModule,
    NbRadioModule,
    NbDatepickerModule,
    NbIconModule,
    NbPopoverModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgxSpinnerModule,
    CommonModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbCheckboxModule,
    NbAccordionModule,
    NbCardModule,
    NbButtonModule,
    FormsModule,
    NbInputModule,
    FileUploadModule,
    SearchRoutingModule,
    ChartsModule,
    NgxHorizontalTimelineModule,
  ],
  providers: [authInterceptorProviders, WindowResultService],
  // exports: [SortAlphabetPipe,]
})
export class SearchModule {}
