import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe,CommonModule } from "@angular/common";
import { FacesService } from "../services/faces.service";
import { AnnotationsService } from "../services/annotations.service";
import { ColorsService } from "../services/colors";
import { StrService } from "../services/strArray";
import { FaceFormComponent } from "./facial_recognition/face-form/face-form.component";
import { FaceListComponent } from "./facial_recognition/face-list/face-list.component";
import { ImagesFormComponent } from "./facial_recognition/images-form/images-form.component";
import { TrustedUrlPipe } from "../pipes/trusted-url.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { UrlPipe } from "../pipes/url.pipe";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { ScheduleComponent } from "./facial_recognition/schedule/schedule.component";
import { LiveComponent } from "./cameras_conf/livestream/live.component";
import { VidComponent } from "./cameras_conf/add_camera/vid.component";
import { LivestreamComponent } from "./cameras_conf/camera_list/livestream.component";
import { ROIComponent } from "./cameras_conf/roi/roi.component";
import { AlgorithmsComponent } from "./cameras_conf/algorithms/algorithms.component";
import { TrustedStylePipe } from "../pipes/trusted-style.pipe";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { SearchComponent } from "./facial_recognition/search/search.component";
import { FormsModule as ngFormsModule } from "@angular/forms";
import { WebcamModule } from 'ngx-webcam';

import {
  NbDialogModule,
  NbLayoutModule,
  NbMenuModule,
  NbPopoverModule,
  NbThemeModule,
  NbTimepickerModule,
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
  NbToastrModule,
  NbToastrConfig,
  NbWindowModule,
  NbWindowConfig,
  NbWindowService,
  NbSidebarModule
} from "@nebular/theme";
 




// import { TableComponent } from './facial_recognition/table/table.component';
import { HeatmapComponent } from "./cameras_conf/heatmap/heatmap.component";

import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { GridComponent } from "./cameras_conf/grid/grid.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { LogInComponent } from "./online/log-in/log-in.component";
import { DashboardComponent } from "./online/dashboard/dashboard.component";
import { AdminComponent } from "./online/admin/admin.component";
import { SetUpComponent } from "./online/set-up/set-up.component";
import { ChangePassComponent } from "./online/change-pass/change-pass.component";
import { authInterceptorProviders } from "../_helpers/auth.interceptor";
import { ButtonComponent } from "./online/button/button.component";
import { TicketComponent } from "./online/ticket/ticket.component";
import { StatusComponent } from "./online/status/status.component";
import { SeverityComponent } from "./online/severity/severity.component";
import { ReviewComponent } from "./online/review/review.component";
import { CenterComponent } from "./online/graphs/center/center.component";
import { PcComponent } from "./online/graphs/pc/pc.component";
import { LoitComponent } from "./online/graphs/loit/loit.component";
import { ChartModule } from "angular2-chartjs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ControlComponent } from "./online/graphs/control/control.component";
import { IntrComponent } from "./online/graphs/intr/intr.component";
import { NgxEchartsModule } from "ngx-echarts";
import { ViolComponent } from "./online/graphs/viol/viol.component";
import { VideoComponent } from "./online/graphs/video/video.component";
import { AodComponent } from "./online/graphs/aod/aod.component";
import { CFaceComponent } from "./online/graphs/c-face/c-face.component";
import { SocialComponent } from "./online/graphs/social/social.component";
import { QueueComponent } from "./online/graphs/queue/queue.component";
import { HelmComponent } from "./online/graphs/helm/helm.component";
import { VaultComponent } from "./online/graphs/vault/vault.component";
import { ParkingComponent } from "./online/graphs/parking/parking.component";
import { AnprComponent } from "./online/graphs/anpr/anpr.component";
import { BarrierComponent } from "./online/graphs/barrier/barrier.component";
import { VehicleComponent } from "./online/graphs/vehicle/vehicle.component";
import { DashComponent } from "./online/graphs/dash/dash.component";
import { TamperComponent } from "./online/graphs/tamper/tamper.component";
import { AnimalsOnRoadComponent } from "./online/graphs/animals-on-road/animals-on-road.component";
import { AccidentComponent } from "./online/graphs/accident/accident.component";
import { AxleComponent } from "./online/graphs/axle/axle.component";
import { CarmakeComponent } from "./online/graphs/carmake/carmake.component";
import { IllegalParkingComponent } from "./online/graphs/illegal-parking/illegal-parking.component";
import { VehicleCountComponent } from "./online/graphs/vehicle-count/vehicle-count.component";
import { WrongTurnComponent } from "./online/graphs/wrong-turn/wrong-turn.component";
import { SpeedingComponent } from "./online/graphs/speeding/speeding.component";
import { FrComponent } from "./online/graphs/fr/fr.component";
import { ClothComponent } from "./online/graphs/cloth/cloth.component";
import { PcCameraComponent } from "./online/graphs/pc-camera/pc-camera.component";
import { BrandCarComponent } from "./online/graphs/brand-car/brand-car.component";
import { GoogleLoginProvider, SocialLoginModule } from "angularx-social-login";
import { MsalModule } from "@azure/msal-angular";
import { PublicClientApplication } from "@azure/msal-browser";
import { Heatmap1Component } from "./online/graphs/heatmap/heatmap.component";
import { PathComponent } from "./online/graphs/path/path.component";
import { FireComponent } from "./online/graphs/fire/fire.component";
import { CollapseComponent } from "./online/graphs/collapse/collapse.component";
import { NgxCaptureModule } from "ngx-capture";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { WeaponComponent } from "./online/graphs/weapon/weapon.component";
import { BottleComponent } from "./online/graphs/bottle/bottle.component";
import { GenerateHelpDeskTicketComponent } from "./helpdesk/generate-helpdesk-ticket/generate-helpdesk-ticket.component";
import { HelpdeskTicketListingComponent } from "./helpdesk/helpdesk-ticket -listing/helpdesk-ticket-listing.component";
import { HelpdeskReplyComponent } from "./helpdesk/helpdesk-reply/helpdesk-reply.component";
import { HelpdeskDetailsComponent } from "./helpdesk/helpdesk-details/helpdesk-details.component";
import { AddIncidentComponent } from "./search/add-incident/add-incident.component";
import { MemoComponent } from "./search/memo/memo.component";
import { IncidentLogsComponent } from "./search/incident-logs/incident-logs.component";
import { ManualTriggerComponent } from "./online/graphs/manual-trigger/manual-trigger.component";
import { PullingHairComponent } from "./online/graphs/pulling-hair/pulling-hair.component";
import { FollowingComponent } from "./online/graphs/following/following.component";
import { PushingComponent } from "./online/graphs/pushing/pushing.component";
import { WavingHandsComponent } from "./online/graphs/waving-hands/waving-hands.component";
import { SmokingComponent } from "./online/graphs/smoking/smoking.component";
import { CrowdComponent } from "./online/graphs/crowd/crowd.component";
import { SlappingComponent } from "./online/graphs/slapping/slapping.component";
import { BlockingComponent } from "./online/graphs/blocking/blocking.component";
import { RunningComponent } from "./online/graphs/running/running.component";
import { DisrobingComponent } from "./online/graphs/disrobing/disrobing.component";
import { PurseSnatchingComponent } from "./online/graphs/purse-snatching/purse-snatching.component";
import { ViewManualTriggerComponent } from "./online/graphs/view-manual-trigger/view-manual-trigger.component";
import { PeopleTrackingComponent } from './online/graphs/people-tracking/people-tracking.component';
import { TranspassingComponent } from './online/graphs/transpassing/transpassing.component';
import { CameraDefocusedComponent } from './online/graphs/camera-defocused/camera-defocused.component';
import { CameraBlindedComponent } from './online/graphs/camera-blinded/camera-blinded.component';
import { SceneChangeComponent } from './online/graphs/scene-change/scene-change.component';
import { ObjectRemovalComponent } from './online/graphs/object-removal/object-removal.component';
import { SmokeDetectionComponent } from './online/graphs/smoke-detection/smoke-detection.component';
import { VelocityComponent } from './online/graphs/velocity/velocity.component';
import { EnterExitComponent } from './online/graphs/enter-exit/enter-exit.component';
import { NoExitComponent } from './online/graphs/no-exit/no-exit.component';
import { HarassmentComponent } from './online/graphs/harassment/harassment.component';
import { AbductionComponent } from './online/graphs/abduction/abduction.component';
import { DirectionComponent } from './online/graphs/direction/direction.component';
import { WindowOpenerComponent } from './online/graphs/window-opener/window-opener.component';
import { SignalLostComponent } from './online/graphs/signal-lost/signal-lost.component';
import { EnterExitVComponent } from './online/graphs/enter-exit-v/enter-exit-v.component';
import { HamCheeseComponent } from './online/graphs/ham-cheese/ham-cheese.component';
import { CongestionComponent } from './online/graphs/congestion/congestion.component';
import { VehLoitComponent } from './online/graphs/veh-loit/veh-loit.component';
import { PpeComponent } from './online/graphs/ppe/ppe.component';
import { StreamComponent } from './online/stream/stream.component';
import { JanusModule } from 'janus-angular';
import { DefectComponent } from './online/graphs/defect/defect.component';
import { ModuleDefectComponent } from './online/graphs/module-defect/module-defect.component';
import { GraffitiComponent } from './online/graphs/graffiti/graffiti.component';
import { AttendanceComponent } from './online/attendance/attendance.component';
import { HealthCheckComponent } from "./cameras_conf/health-check/health-check.component";
import { WebcamComponent } from './facial_recognition/webcam/webcam.component';
import { AmComponent } from './online/graphs/am/am.component';
import { AmcComponent } from './online/graphs/amc/amc.component';
import { TrafficSignalComponent } from './online/graphs/traffic-signal/traffic-signal.component';
import { FlashingComponent } from './online/graphs/flashing/flashing.component';
import { StalkingWomanAreaComponent } from './online/graphs/stalking-woman-area/stalking-woman-area.component';
import { StalkingWomanNightComponent } from './online/graphs/stalking-woman-night/stalking-woman-night.component';
import { StalkingWomanScootyComponent } from './online/graphs/stalking-woman-scooty/stalking-woman-scooty.component';
import { SummarizationComponent } from './online/summarization/summarization.component';
import { InjuryAndBloodComponent } from './online/graphs/injury-and-blood/injury-and-blood.component';
import { SuicideTendencyComponent } from './online/graphs/suicide-tendency/suicide-tendency.component';
import { SmokersGroupComponent } from './online/graphs/smokers-group/smokers-group.component';
import { DrinkersGroupComponent } from './online/graphs/drinkers-group/drinkers-group.component';
import { TeasingWomenComponent } from './online/graphs/teasing-women/teasing-women.component';
import { OpenDefecationComponent } from './online/graphs/open-defecation/open-defecation.component';
import { AcidAttackComponent } from './online/graphs/acid-attack/acid-attack.component';
import { AudioGunshotComponent } from './online/graphs/audio-gunshot/audio-gunshot.component';
import { ZigzagComponent } from './online/graphs/zigzag/zigzag.component';
import { MalebehComponent } from './online/graphs/malebeh/malebeh.component';
import { MalemovementComponent } from './online/graphs/malemovement/malemovement.component';
import { AbnormalComponent } from './online/graphs/abnormal/abnormal.component';
import { JaywalkingComponent } from './online/graphs/jaywalking/jaywalking.component';
import { AbnormalRunningComponent } from './online/graphs/abnormal-running/abnormal-running.component';
import { GamblingComponent } from './online/graphs/gambling/gambling.component';
import { FrequentVisitingComponent } from './online/graphs/frequent-visiting/frequent-visiting.component';
import { StrandedGirlComponent } from './online/graphs/stranded-girl/stranded-girl.component';
import { UnconsciousComponent } from './online/graphs/unconscious/unconscious.component';
import { StuntBikersComponent } from './online/graphs/stunt-bikers/stunt-bikers.component';
import { AddComponent } from './micConf/add/add.component';
import { ListComponent } from './micConf/list/list.component';
import { FileComponent } from './micConf/file/file.component';
import { InkthrowingComponent } from './online/graphs/inkthrowing/inkthrowing.component';
import { DrugsdistributionComponent } from './online/graphs/drugsdistribution/drugsdistribution.component';
import { PrnmaterialComponent } from './online/graphs/prnmaterial/prnmaterial.component';
import { KidnappingComponent } from './online/graphs/kidnapping/kidnapping.component';
import { WomenSafetyComponent } from './online/graphs/women-safety/women-safety.component';
import { WomenCollapseComponent } from './online/graphs/women-collapse/women-collapse.component';
import { WomenViolenceComponent } from './online/graphs/women-violence/women-violence.component';
import { SlapingWComponent } from './online/graphs/slaping-w/slaping-w.component';
import { NprComponent } from './online/graphs/npr/npr.component';
import { BoysShadowComponent } from './online/graphs/boys-shadow/boys-shadow.component';
import { FreqVisitorComponent } from './online/graphs/freq-visitor/freq-visitor.component';
import { RecordingWinComponent } from './cameras_conf/recording-win/recording-win.component'
import { SortAlphabetPipe } from "../pipes/sort-alphabet.pipe";
import { DeleteWinComponent } from './delete-win/delete-win.component';
import { SettingsComponent } from './settings/settings.component';
//import { SummerComponent } from './cameras_conf/summer/summer.component';
import { RtspComponent } from './online/graphs/rtsp/rtsp.component'

import { SummerComponent } from './cameras_conf/summer/summer.component';
import { VehiclesComponent } from './online/vehicles/vehicles.component';
import { PersonComponent } from './online/person/person.component';
import { ColorpalleteComponent } from './online/colorpallete/colorpallete.component';
import { VideospeedComponent } from './online/videospeed/videospeed.component';
import { TimerangeComponent } from './online/timerange/timerange.component';
import { ViolencesumComponent } from './online/violencesum/violencesum.component';
import { CollapsesumComponent } from './online/collapsesum/collapsesum.component';
import { AbardonedsumComponent } from './online/abardonedsum/abardonedsum.component';
import { WeaponsumComponent } from './online/weaponsum/weaponsum.component';
import { OverspeedsumComponent } from './online/overspeedsum/overspeedsum.component';
import { AnprsumComponent } from './online/anprsum/anprsum.component';
import { BlacklistedpersonsumComponent } from './online/blacklistedpersonsum/blacklistedpersonsum.component';
import { AccidentssumComponent } from './online/accidentssum/accidentssum.component';
import { WrongwaysumComponent } from './online/wrongwaysum/wrongwaysum.component';
import { ZigzagsumComponent } from './online/zigzagsum/zigzagsum.component';
import { ImagebigComponent } from './online/graphs/imagebig/imagebig.component';
import { UniformtrackingComponent } from './online/graphs/uniformtracking/uniformtracking.component';
import { EdgeCrossingComponent } from './online/graphs/edge-crossing/edge-crossing.component';
import { JumpTrackComponent } from './online/graphs/jump-track/jump-track.component';
import { VideoorimgedashboardComponent } from './online/videoorimgedashboard/videoorimgedashboard.component';
import { LinegraphsComponent } from './online/graphs/linegraphs/linegraphs.component';
import { StreetVendorComponent } from './online/graphs/street-vendor/street-vendor.component';
import { NurseDwellComponent } from './online/graphs/nurse-dwell/nurse-dwell.component';
import { ClimbingBarricadeComponent } from './online/graphs/climbing-barricade/climbing-barricade.component';
import { NextivaComponent } from './online/nextiva/nextiva.component';
import { AbsencesComponent } from './online/graphs/absences/absences.component';
import { AbsencesnopersonComponent } from './online/graphs/absencesnoperson/absencesnoperson.component';
import { BycicleMotorComponent } from './online/graphs/bycicle-motor/bycicle-motor.component';

@NgModule({
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    
    WebcamModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    JanusModule,
    NgxChartsModule,
    ChartModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbSelectModule,
    ngFormsModule,
    NbAccordionModule,
    NbButtonModule,
    NbListModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbFormFieldModule,
    NbTabsetModule,
    NbUserModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    NbPopoverModule,
    SocialLoginModule,
    NgxCaptureModule,
    NbWindowModule,
    NbWindowModule.forRoot(),
    NbWindowModule.forChild(),
    NbSidebarModule.forRoot(),

    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "e1486010-fe9f-499f-92c3-c813ea490cb8", // This is your client ID
          authority: "https://login.microsoftonline.com" + "/" + "common",
          redirectUri: "http://localhost:4200", // This is your redirect URI
        },
        cache: {
          cacheLocation: "localStorage",
        },
      }),
      null,
      null
    ),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [
    SortAlphabetPipe,
    PagesComponent,
    FaceFormComponent,
    ImagesFormComponent,
    TrustedUrlPipe,
    UrlPipe,
    PagenotfoundComponent,
    FaceListComponent,
    ScheduleComponent,
    LiveComponent,
    VidComponent,
    LivestreamComponent,
    ROIComponent,
    AlgorithmsComponent,
    TrustedStylePipe,
    AnalyticsComponent,
    SearchComponent,
    // TableComponent,
    GridComponent,
    // OverallComponent,
    HeatmapComponent,
    LogInComponent,
    DashboardComponent,
    AdminComponent,
    SetUpComponent,
    ChangePassComponent,
    ButtonComponent,
    TicketComponent,
    StatusComponent,
    SeverityComponent,
    ReviewComponent,
    CenterComponent,
    PcComponent,
    LoitComponent,
    ControlComponent,
    IntrComponent,
    ViolComponent,
    VideoComponent,
    AodComponent,
    CFaceComponent,
    SocialComponent,
    QueueComponent,
    HelmComponent,
    VaultComponent,
    ParkingComponent,
    AnprComponent,
    BarrierComponent,
    VehicleComponent,
    DashComponent,
    TamperComponent,
    AnimalsOnRoadComponent,
    AccidentComponent,
    AxleComponent,
    CarmakeComponent,
    IllegalParkingComponent,
    VehicleCountComponent,
    WrongTurnComponent,
    SpeedingComponent,
    FrComponent,
    ClothComponent,
    SettingsComponent,
    PcCameraComponent,
    BrandCarComponent,
    Heatmap1Component,
    PathComponent,
    FireComponent,
    CollapseComponent,
    WeaponComponent,
    BottleComponent,
    GenerateHelpDeskTicketComponent,
    HelpdeskTicketListingComponent,
    HelpdeskReplyComponent,
    HelpdeskDetailsComponent,
    AddIncidentComponent,
    MemoComponent,
    IncidentLogsComponent,
    ManualTriggerComponent,
    PullingHairComponent,
    FollowingComponent,
    PushingComponent,
    WavingHandsComponent,
    SmokingComponent,
    CrowdComponent,
    SlappingComponent,
    BlockingComponent,
    RunningComponent,
    DisrobingComponent,
    PurseSnatchingComponent,
    ViewManualTriggerComponent,
    PeopleTrackingComponent,
    TranspassingComponent,
    CameraDefocusedComponent,
    CameraBlindedComponent,
    SceneChangeComponent,
    ObjectRemovalComponent,
    SmokeDetectionComponent,
    VelocityComponent,
    EnterExitComponent,
    NoExitComponent,
    HarassmentComponent,
    AbductionComponent,
    DirectionComponent,
    WindowOpenerComponent,
    SignalLostComponent,
    EnterExitVComponent,
    HamCheeseComponent,
    CongestionComponent,
    VehLoitComponent,
    PpeComponent,
    StreamComponent,
    DefectComponent,
    ModuleDefectComponent,
    GraffitiComponent,
    AttendanceComponent,
    HealthCheckComponent,
    WebcamComponent,
    AmComponent,
    AmcComponent,
    TrafficSignalComponent,
    FlashingComponent,
    StalkingWomanAreaComponent,
    StalkingWomanNightComponent,
    StalkingWomanScootyComponent,
    SummarizationComponent,
    InjuryAndBloodComponent,
    SuicideTendencyComponent,
    SmokersGroupComponent,
    DrinkersGroupComponent,
    TeasingWomenComponent,
    OpenDefecationComponent,
    AcidAttackComponent,
    AudioGunshotComponent,
    ZigzagComponent,
    MalebehComponent,
    MalemovementComponent,
    AbnormalComponent,
    JaywalkingComponent,
    AbnormalRunningComponent,
    GamblingComponent,
    FrequentVisitingComponent,
    StrandedGirlComponent,
    UnconsciousComponent,
    StuntBikersComponent,
    AddComponent,
    ListComponent,
    FileComponent,
    InkthrowingComponent,
    DrugsdistributionComponent,
    PrnmaterialComponent,
    KidnappingComponent,
    WomenSafetyComponent,
    WomenCollapseComponent,
    WomenViolenceComponent,
    SlapingWComponent,
    NprComponent,
    BoysShadowComponent,
    FreqVisitorComponent,
    RecordingWinComponent,
    DeleteWinComponent,
 
    SummerComponent,
    VehiclesComponent,
    PersonComponent,
    ColorpalleteComponent,
    VideospeedComponent,
    TimerangeComponent,
    ViolencesumComponent,
    CollapsesumComponent,
    AbardonedsumComponent,
    WeaponsumComponent,
    OverspeedsumComponent,
    AnprsumComponent,
    BlacklistedpersonsumComponent,
    AccidentssumComponent,
    SettingsComponent,
    WrongwaysumComponent,
    ZigzagsumComponent,
    ImagebigComponent,
    UniformtrackingComponent,
    EdgeCrossingComponent,
    JumpTrackComponent,
    VideoorimgedashboardComponent,
    LinegraphsComponent,
    StreetVendorComponent,
    NurseDwellComponent,
    ClimbingBarricadeComponent,
    NextivaComponent,
    AbsencesComponent,
    AbsencesnopersonComponent,
    BycicleMotorComponent,
  ],
  providers: [
    // SortAlphabetPipe,
    FacesService,
    DatePipe,
    ColorsService,
    StrService,
    AnnotationsService,
    authInterceptorProviders,
    NbWindowConfig,
    NbWindowService,
    { provide: NbToastrConfig, useValue: { /* Your configuration options here */ } },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "177947832755-0kqanmd36fjt3v3lbr7nqs1aghevs56e.apps.googleusercontent.com"
            ), // your client id
          },
        ],
      },
    },
  ],
  exports: [SortAlphabetPipe]
})
export class PagesModule { }
