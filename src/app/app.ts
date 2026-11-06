import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from './core/smooth-scroll.service';
import { Footer } from './sections/footer';
import { Navbar } from './sections/navbar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Footer, Navbar, RouterOutlet],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: ['main { overflow-x: clip; }']
})
export class App implements AfterViewInit {
  private readonly smooth = inject(SmoothScrollService);

  ngAfterViewInit(): void {
    this.smooth.init();
  }
}
