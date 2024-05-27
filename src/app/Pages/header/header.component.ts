import { Component, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const container = document.querySelector('.container-fluid');

        if (this.router.url === '/profile') {
          this.renderer.setStyle(container, 'background-color', 'rgb(41, 136, 230)');
          this.renderer.removeStyle(container, 'position');
        } else {
          this.renderer.removeStyle(container, 'background-color');
          this.renderer.setStyle(container, 'position', 'absolute');
        }
      }
    });
  }
}
