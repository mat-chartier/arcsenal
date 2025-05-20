import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blason-interactif',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blason-interactif.component.html',
  styleUrl: './blason-interactif.component.scss'
})
export class BlasonInteractifComponent {
  @Input() autresImpacts: { x: number, y: number }[] = []
  @Input() impactMoyen: { x: number, y: number } | null = null
  @Output() nouvelImpact = new EventEmitter<{ x: number, y: number }>()

  @ViewChild('blasonSvg') blasonSvg!: ElementRef<SVGSVGElement>;

  zones = [
    { r: 100, color: 'white', strokeWidth: 0.2 },
    { r: 90, color: 'white', strokeWidth: 0.5 },
    { r: 80, color: 'black', strokeWidth: 0.2 },
    { r: 70, color: 'black', strokeWidth: 0.5 },
    { r: 60, color: '#05c1f2', strokeWidth: 0.2 },
    { r: 50, color: '#05c1f2', strokeWidth: 0.5 },
    { r: 40, color: 'red', strokeWidth: 0.2 },
    { r: 30, color: 'red', strokeWidth: 0.5 },
    { r: 20, color: 'yellow', strokeWidth: 0.2 },
    { r: 10, color: 'yellow', strokeWidth: 0.5 }
  ];
  viewBoxX = 0;
  viewBoxY = 0;
  startX = 0;
  startY = 0;
  moving = false;
  impactScreenX = 0;
  impactScreenY = 0;
  impactVisible = false;


  fleches: { x: number; y: number }[] = [];

  placerFleche(event: MouseEvent | TouchEvent) {
    const svg = this.blasonSvg.nativeElement;
    const pt = svg.createSVGPoint();

    if (event instanceof MouseEvent) {
      pt.x = event.clientX;
      pt.y = event.clientY;
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      this.fleches.push({ x: cursorpt.x, y: cursorpt.y });
      this.nouvelImpact.emit({ x: cursorpt.x, y: cursorpt.y });
    }

  }

  startDrag(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.moving = true;
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;

      const rect = this.blasonSvg.nativeElement.getBoundingClientRect();
      this.impactScreenX = event.touches[0].clientX - rect.left;
      this.impactScreenY = event.touches[0].clientY - rect.top - 35;
      this.impactVisible = true;

      event.preventDefault();
    }
  }

  drag(event: TouchEvent) {
    if (this.moving && event.touches.length === 1) {
      const dx = event.touches[0].clientX - this.startX;
      const dy = event.touches[0].clientY - this.startY;

      this.viewBoxX -= dx * 0.5; // facteur de vitesse réglable
      this.viewBoxY -= dy * 0.5;

      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      event.preventDefault();
    }
  }

  endDrag() {
    if (this.moving) {
      const svg = this.blasonSvg.nativeElement;
      const pt = svg.createSVGPoint();

      // Position absolue écran du point d’impact (en pixels)
      pt.x = this.impactScreenX + svg.getBoundingClientRect().left;
      pt.y = this.impactScreenY + svg.getBoundingClientRect().top;

      // Conversion en coordonnées SVG
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      this.fleches.push({ x: cursorpt.x, y: cursorpt.y });

      // Reset viewBox et impact
      this.viewBoxX = 0;
      this.viewBoxY = 0;
      this.impactVisible = false;
      this.moving = false;

      this.nouvelImpact.emit({ x: cursorpt.x, y: cursorpt.y });
    }
  }

}
