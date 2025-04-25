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
  currentStep = 'product'; // Tracks the current step (always 'product' for non-serialized)

  constructor(private router: Router) {
    // Listen to navigation events to update the current step
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentStep(event.urlAfterRedirects);
      });
  }

  private updateCurrentStep(url: string): void {
    // For non-serialized, there's only one step: 'product'
    if (url.includes('product')) {
      this.currentStep = 'product';
    }
  }
}