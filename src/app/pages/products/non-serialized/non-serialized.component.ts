import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-non-serialized',
  standalone: false,
  templateUrl: './non-serialized.component.html',
  styleUrls: ['./non-serialized.component.scss']
})
export class NonSerializedComponent {
  currentStep = 'product'; 

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentStep(event.urlAfterRedirects);
      });
  }

  private updateCurrentStep(url: string): void {
    if (url.includes('reference')) {
      this.currentStep = 'reference';
    } else {
      this.currentStep = 'product';
    }
  }
}