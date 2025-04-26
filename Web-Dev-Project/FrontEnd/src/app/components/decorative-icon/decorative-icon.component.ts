import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-decorative-icon',
  templateUrl: './decorative-icon.component.html',  // Link to HTML template
  styleUrls: ['./decorative-icon.component.css'],  // Link to CSS file
  standalone: true,
})
export class DecorativeIconComponent implements OnInit, OnDestroy {
  private icons: HTMLElement[] = [];  // Array to store created icons

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.createIcons();  // Create the icons when the component is initialized
  }

  ngOnDestroy(): void {
    this.removeIcons();  // Cleanup when the component is destroyed
  }

  createIcons(): void {
    const iconSize = 80;                 // Slightly smaller for more icons
    const horizontalSpacing = 160;      // Tighter grid horizontally
    const verticalSpacing = 140;        // Tighter grid vertically

    const numCols = Math.floor(window.innerWidth / horizontalSpacing);
    const numRows = Math.floor(window.innerHeight / verticalSpacing);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const icon = this.renderer.createElement('img');
        this.renderer.setAttribute(icon, 'src', 'assets/icons/icons8-jake-100.png');
        this.renderer.addClass(icon, 'background-icon');
        const shift = (row % 2 === 0) ? 0 : horizontalSpacing / 2;

        const top = row * verticalSpacing + (verticalSpacing - iconSize) / 2;
        const left = col * horizontalSpacing + shift + (horizontalSpacing - iconSize) / 2;

        this.renderer.setStyle(icon, 'position', 'fixed');
        this.renderer.setStyle(icon, 'top', `${top}px`);
        this.renderer.setStyle(icon, 'left', `${left}px`);
        this.renderer.setStyle(icon, 'width', `${iconSize}px`);
        this.renderer.setStyle(icon, 'pointer-events', 'none');
        this.renderer.setStyle(icon, 'z-index', '-1');

        this.renderer.appendChild(document.body, icon);
        this.icons.push(icon);  // Store the created icon in the array
        this.renderer.setStyle(icon, 'filter', 'opacity(0.5)');  // Adjust brightness to 40%
      }
    }
  }

  removeIcons(): void {
    // Loop through all created icons and remove them
    this.icons.forEach(icon => {
      this.renderer.removeChild(document.body, icon);
    });
    this.icons = [];  // Clear the array after removal
  }
}
