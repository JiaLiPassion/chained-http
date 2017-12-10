import { HttpClient } from '@angular/common/http';
import { Component, NgZone, Testability } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export enum State {
  initial,
  beforeBoth,
  afterFirst,
  afterSecond,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  State = State;
  title = 'app';
  state: State = State.initial;
  whenStableCalls = 0;

  constructor(private http: HttpClient, private testability: Testability, private zone: NgZone) {
  }

  initCalls() {
    this.state = State.beforeBoth;
    this.whenStableCalls = 0;
  }

  setStable() {
    this.zone.run(() => ++this.whenStableCalls);
  }

  doChainedHttpCalls() {
    this.initCalls();

    this.http
      .get('https://httpbin.org/delay/1')
      .switchMap(() => {
        this.state = State.afterFirst;
        return this.http.get('https://httpbin.org/delay/1');
      })
      .subscribe(() => {
        this.state = State.afterSecond;
      });

    this.zone.runOutsideAngular(() => this.testability.whenStable(() => this.setStable()));
  }

  doChainedTimeout() {
    this.initCalls();

    Observable.timer(1000)
      .switchMap(() => {
        this.state = State.afterFirst;
        return Observable.timer(1000);
      })
      .subscribe(() => {
        this.state = State.afterSecond;
      });
      
    this.zone.runOutsideAngular(() => this.testability.whenStable(() => this.setStable()));
  }
}
