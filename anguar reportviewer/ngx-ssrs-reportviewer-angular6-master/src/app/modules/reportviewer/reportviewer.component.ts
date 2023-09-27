import {
  Component, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'ssrs-reportviewer',
  templateUrl: './reportviewer.component.html',
  styleUrls: ['./reportviewer.component.css']
})
export class ReportViewerComponent implements OnChanges {
  @ViewChild('iframe') iframe: ElementRef;

  @Input()
  reporturl: string;
  @Input()
  reportserver: string;
  @Input()
  showparameters = 'false';
  @Input()
  parameters?: any;
  @Input()
  language = 'en-us';
  @Input()
  width = 100;
  @Input()
  height = 100;
  @Input()
  toolbar = 'true';


  @Output('error') onError = new EventEmitter<any>();
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
  }


  source: SafeResourceUrl;

  ngOnChanges(changes: SimpleChanges) {
    if (!this.reporturl) {
      this.onError.emit('Src cannot be null');
    }

    if ('reporturl' in changes) {
      // this.source = this.sanitizer.bypassSecurityTrustResourceUrl(this.buildReportUrl());

      // this.get(this.buildReportUrl(), null).subscribe(data => this.iframe.nativeElement.src = data);
      this.getService().subscribe(
        res => {
          debugger
          this.iframe.nativeElement.data = 'http://200.253.1.82/ReportServer_WEBFLOR/Pages/ReportViewer.aspx?/WebFlorDespacho/rptFactura&rs:Embed=true&rc:Parameters=true&IdFactura=1&rs:ParameterLanguage=en-us&rc:Toolbar=true';
        }
      )

      //this.iframe.nativeElement.data = 'http://200.253.1.82/ReportServer_WEBFLOR/Pages/ReportViewer.aspx?/WebFlorDespacho/rptFactura&rs:Embed=true&rc:Parameters=true&IdFactura=1&rs:ParameterLanguage=en-us&rc:Toolbar=true';
    }
  }

  createAuthorizationHeader() {
    const token = sessionStorage.getItem('access_token');
    return new HttpHeaders()
      .set('X-Origin', 'http://localhost:4200/')
      .set('Allow-Control-Allow-Origin', '*')
      .set('Allow-Control-Allow-Headers', '*')
      .set('Allow-Control-Allow-Methods', '*')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic ' + btoa('REDESIS\\rcaballero:Redesis2011$'));
  }

  get(url: string, params: HttpParams) {
    return this.http.get(url.replace('{hostname}', window.location.hostname),
                          { withCredentials: true })
    // .catch(err => /*this.handleError(err)*/ )
    ;
  }

  getService() {
    return this.http.get('http://localhost/PruebaAPI/api/test', { withCredentials: true});
  }


  public buildParameterString(): string {

    let parameterString = '';

    for (const param in this.parameters) {
      if (param) {
        if (this.parameters[param] instanceof Array === true) {
          for (const arrayParam in this.parameters[param]) {
            if (arrayParam) {
              parameterString += '&' + param + '=' + this.parameters[param][arrayParam];
            }
          }
        }
        if (this.parameters[param] != null && this.parameters[param] instanceof Array === false) {
          parameterString += '&' + param + '=' + this.parameters[param];
        }
        if (this.parameters[param] == null) {
          parameterString += '&' + param + ':isnull=true';
        }
      }
    }
    return parameterString;
  }

  public buildReportUrl(): string {
    if (!this.reporturl) {
      return;
    }
    const parameters = this.buildParameterString();
    return this.reportserver + '?/'
      + this.reporturl + '&rs:Embed=true'
      + '&rc:Parameters=' + this.showparameters
      + parameters
      + '&rs:ParameterLanguage=' + this.language + '&rc:Toolbar=' + this.toolbar;
  }
}
