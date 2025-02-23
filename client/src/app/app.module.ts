import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { FacesService } from "./services/faces.service";
import { DatePipe } from "@angular/common";
import { AnnotationsService } from "./services/annotations.service";
import { ColorsService } from "./services/colors";
import { StrService } from "./services/strArray";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbChatModule,
  NbDatepickerModule,
  NbMenuModule,
  NbSidebarModule,
  NbTimepickerModule,
  NbWindowModule,
  NbCardModule,
  NbLayoutModule,
  NbDialogModule,
} from "@nebular/theme";
import { authInterceptorProviders } from "./_helpers/auth.interceptor";
import { SortAlphabetPipe } from './pipes/sort-alphabet.pipe';
import { DisableService } from "./services/disable.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
 

@NgModule({
  declarations: [AppComponent ],
  imports: [
    DragDropModule,
    NbLayoutModule,
    NbCardModule,
    Ng2SmartTableModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbDialogModule.forChild(),
    NbWindowModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  providers: [
    // SortAlphabetPipe,
    FacesService,
    DatePipe,
    ColorsService,
    StrService,
    AnnotationsService,
    authInterceptorProviders,
    DisableService,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
