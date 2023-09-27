
import { Component } from '@angular/core';

@Component({
  selector: 'app-ssrs',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  reportServer = 'http://200.253.1.82/ReportServer_WEBFLOR/';
  reportUrl = 'WebFlorDespacho/rptFactura';
  showParameters = 'false'; // true, false, collapsed
  parameters: any = {
    'IdFactura': 1,
  };
  language = 'en-us';
  width = 50;
  height = 400;
  toolbar = 'true';
  error = null;
}

