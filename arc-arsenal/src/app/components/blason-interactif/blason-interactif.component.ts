import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

const decalageVertical = 40;
@Component({
  selector: 'app-blason-interactif',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blason-interactif.component.html',
  styleUrl: './blason-interactif.component.scss'
})
export class BlasonInteractifComponent {
  @ViewChild('blasonSvg') blasonSvg!: ElementRef<SVGSVGElement>;

  @Input() autresImpacts: { x: number, y: number, arrow: number }[] = [];
  @Input() impactsMoyens: { x: number, y: number, arrow: number }[] | null = null;
  @Output() nouvelImpact = new EventEmitter<{ x: number, y: number }>();

  zones = [
    { r: 84, color: '#05c1f2', strokeWidth: 0.2 },
    { r: 70, color: '#05c1f2', strokeWidth: 0.5 },
    { r: 56, color: 'red', strokeWidth: 0.2 },
    { r: 42, color: 'red', strokeWidth: 0.5 },
    { r: 28, color: 'yellow', strokeWidth: 0.2 },
    { r: 14, color: 'yellow', strokeWidth: 0.5 },
    { r: 7, color: 'yellow', strokeWidth: 0.2 }
  ];

  moving = false;
  impactEnCours: { x: number, y: number } | null = null;

  zoomActive = false;
  zoomFactor = 2;
  zoomRefX = 0;
  zoomRefY = 0;

  startDrag(event: TouchEvent) {
    if (event.touches.length === 1) {
      const svg = this.blasonSvg.nativeElement;
      const pt = svg.createSVGPoint();
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY - decalageVertical;
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      this.impactEnCours = { x: cursorpt.x, y: cursorpt.y };

      // Calcul position relative dans le viewBox initial
      const viewBoxSize = 200;
      const relX = cursorpt.x / viewBoxSize;
      const relY = cursorpt.y / viewBoxSize;

      // Nouvelle taille du viewBox après zoom
      const newSize = viewBoxSize / this.zoomFactor;

      // Calcul du nouveau viewBox pour garder le point fixe à l'écran
      this.zoomRefX = cursorpt.x - relX * newSize;
      this.zoomRefY = cursorpt.y - relY * newSize;

      this.zoomActive = true;
      this.moving = true;

      event.preventDefault();
    }
  }


  drag(event: TouchEvent) {
    if (this.moving && event.touches.length === 1) {
      const svg = this.blasonSvg.nativeElement;
      const pt = svg.createSVGPoint();
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY - decalageVertical;
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      // Mettre à jour position de l'impact en cours
      this.impactEnCours = { x: cursorpt.x, y: cursorpt.y };
      event.preventDefault();
    }
  }

  endDrag() {
    if (this.moving && this.impactEnCours) {
      this.nouvelImpact.emit({ x: this.impactEnCours.x, y: this.impactEnCours.y });

      // Remise à zéro
      this.impactEnCours = null;
      this.zoomActive = false;
      this.moving = false;
    }
  }

  getViewBox() {
    if (this.zoomActive) {
      const size = 200 / this.zoomFactor;
      return `${this.zoomRefX} ${this.zoomRefY} ${size} ${size}`;
    } else {
      return `0 0 200 200`;
    }
  }

  // Helper function to calculate text Y position
  getTextY(cy: number, r: number, padding: number = 2): number {
    return cy - r - padding;
  }
}
