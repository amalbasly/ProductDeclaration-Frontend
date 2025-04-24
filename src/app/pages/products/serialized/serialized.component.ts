import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-serialized',
  standalone : false,
  templateUrl: './serialized.component.html',
  styleUrls: ['./serialized.component.scss']
})
export class SerializedComponent {
  currentStep = 'product';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentStep(event.urlAfterRedirects);
      });
  }

  private updateCurrentStep(url: string): void {
    if (url.includes('synoptique')) {
      this.currentStep = 'synoptique';
    } else {
      this.currentStep = 'product';
    }
  }
}