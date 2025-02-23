import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  NbCalendarRange,
  NbDateService,
  NbPopoverDirective,
  NbWindowRef,
} from "@nebular/theme";
import { BehaviorSubject, Observable } from "rxjs";
import { FacesService } from "../../../services/faces.service";

@Component({
  selector: "ngx-setngs",
  templateUrl: "./setngs.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./setngs.component.scss"],
})
export class SetngsComponent implements OnInit {
  constructor(
    protected windowRef: NbWindowRef,
    protected dateService: NbDateService<Date>,
    private accountserv: FacesService
  ) {
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 59));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    this.selectedDate = this.dateService.addDay(this.dateService.today(), 0);
    this.range = {
      start: this.max,
      end: this.fin,
    };
  }
  @ViewChild(NbPopoverDirective) rangeSelector: NbPopoverDirective;
  @ViewChild("dateTimePicker", { static: false }) dateTime: ElementRef;
  @Input() onChange: Function;
  @Input() filters: Object;
  @Output() settings: EventEmitter<any> = new EventEmitter();

  calMonths: string[] = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  selectedDate: Date;
  selectedMonth: Date;
  lastMonths: Date[] = [];
  range: NbCalendarRange<Date>;
  max: Date;
  fin: Date;
  showRange: boolean;
  algos: Array<any>;
  algorithm: string = "";
  showIt: boolean = true;
  addRange: boolean = false;
  and: boolean = false;
  bounded: Object = {
    active: false,
    time: 1,
  };
  only: boolean = false;
  dateTouched: boolean = false;
  option: string;
  isBookMarked: boolean = false;

  currentSelection: string = "Date";
  getNavChangeEmitter() {
    return this.settings;
  }

  adapt(thing) {
    if (thing === "and") {
      this.and = true;
      this.only = false
      this.bounded = {
        active: false,
        time: 1,
      };
    } else if (thing === "bounded") {
      this.only = false
      this.and = false;
      this.bounded["active"] = true;
    } else if (thing === 'only'){
      this.and = false;
      this.bounded = {
        active: false,
        time: 1,
      };
      this.only = true
    }
  }

  show() {
    console.log(this.range);
  }

  getAlgos() {
    this.accountserv.getAlgos().subscribe(
      (res) => {
        this.algos = res["data"];
      },
      (err) => console.log(err)
    );
  }
  selectRangeType(type) {
    this.currentSelection = type;
  }

  showRangeSelector(show: boolean) {
    if (show) {
      this.addRange = true;
      this.rangeSelector.show();
      this.showIt = !this.showIt;
    } else {
      this.rangeSelector.hide();
      this.showIt = !this.showIt;
    }
  }
  initMonths() {
    let t = this.dateService.today();

    // Go to start of the month
    let daysToMinus = t.getDate() - 1;
    daysToMinus *= -1;
    t = this.dateService.addDay(t, daysToMinus);

    this.lastMonths.push(t);
    for (let i = 1; i <= 12; i++) {
      const a = -1 * i;
      this.lastMonths.push(this.dateService.addMonth(t, a));
    }
  }

  setDate(event) {
    this.selectedDate = event;
    if (this.selectedDate) {
      this.dateTouched = true;
      const start = this.selectedDate;
      // Add one data and minus 1 sec to set time to end of the day
      let end = this.dateService.addDay(start, 1);
      end = new Date(end.getTime() - 1000);
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.showRangeSelector(false);
    }
  }

  setMonth() {
    if (this.selectedMonth) {
      this.dateTouched = true;
      const start = this.selectedMonth;
      // Add one month and minus 1 second to go to the end of the month
      let end = this.dateService.addMonth(start, 1);
      end = new Date(end.getTime() - 1000);
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.showRangeSelector(false);
    }
  }

  changeRange(event) {
    if (event.end !== undefined) {
      this.dateTouched = true;
      this.showRange = false;
      event.end = new Date(event.end.setHours(event.end.getHours() + 23));
      event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 59));
      event.end = new Date(event.end.setSeconds(event.end.getSeconds() + 59));
      this.range = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      this.showRangeSelector(false);
    } else {
      this.showRange = true;
    }
  }

  apply() {
    let filters = {};
    if (this.algorithm !== "") {
      filters["algo"] = this.algorithm;
    }
    if (this.addRange) {
      filters["rangeType"] = this.currentSelection;
      filters["range"] = this.range;
    }
    if (this.and) {
      filters["and"] = this.and;
    }
    if (this.bounded["active"]) {
      filters["bounded"] = this.bounded;
    }
    if (this.isBookMarked) {
      filters["isBookMarked"] = this.isBookMarked;
    }
    if (this.only) {
      filters["only"] = this.only;
    }

    this.onChange(filters);
    this.windowRef.close();
  }

  ngOnInit() {
    this.getAlgos();
    if (this.filters["rangeType"]) {
      this.dateTouched = true;
      this.currentSelection = this.filters["rangeType"];
    }
    if (this.filters["algo"]) {
      this.algorithm = this.filters["algo"];
    }
    if (this.filters["range"]) {
      this.range = this.filters["range"];
      this.addRange = true;
    }
    if (this.filters["and"]) {
      this.and = this.filters["and"];
      this.option = "and";
    }
    if (this.filters["bounded"]) {
      this.bounded = this.filters["bounded"];
      this.option = "bounded";
    }
    if (this.filters["isBookMarked"]) {
      this.isBookMarked = this.filters["isBookMarked"];
    }
    if (this.filters["only"]) {
      this.only = this.filters["only"];
      this.option = 'only'
    }
    this.initMonths();
  }
}

@Injectable()
export class WindowResultService {
  private stream = new BehaviorSubject<any>(undefined);
  public get(): Observable<any> {
    return this.stream;
  }
  public next(data: any) {
    this.stream.next(data);
  }
}
