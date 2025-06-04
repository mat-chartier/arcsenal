import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

const decalageVertical = 40;
@Component({
  selector: 'app-interactive-target-face',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-face.component.html',
  styleUrl: './target-face.component.scss'
})
export class InteractiveTargetFaceComponent {

  @ViewChild('targetFaceSvg') targetFaceSvg!: ElementRef<SVGSVGElement>;

  @Input() otherImpacts: { x: number, y: number, arrow: number }[] = [];
  @Input() averageImpacts: { x: number, y: number, arrow: number }[] | null = null;
  @Output() newImpact = new EventEmitter<{ x: number, y: number }>();

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
  currentImpact: { x: number, y: number } | null = null;

  zoomActive = false;
  zoomFactor = 2;
  zoomRefX = 0;
  zoomRefY = 0;

  startDrag(event: TouchEvent) {
    if (event.touches.length === 1) {
      const svg = this.targetFaceSvg.nativeElement;
      const pt = svg.createSVGPoint();
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY - decalageVertical;
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      this.currentImpact = { x: cursorpt.x, y: cursorpt.y };

      // Get relative position relative in initial viewBox
      const viewBoxSize = 200;
      const relX = cursorpt.x / viewBoxSize;
      const relY = cursorpt.y / viewBoxSize;

      // viewBox new size after zoom
      const newSize = viewBoxSize / this.zoomFactor;

      // Compute new viewBox to keep the impact static on screen
      this.zoomRefX = cursorpt.x - relX * newSize;
      this.zoomRefY = cursorpt.y - relY * newSize;

      this.zoomActive = true;
      this.moving = true;

      event.preventDefault();
    }
  }

  drag(event: TouchEvent) {
    if (this.moving && event.touches.length === 1) {
      const svg = this.targetFaceSvg.nativeElement;
      const pt = svg.createSVGPoint();
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY - decalageVertical;
      const cursorpt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      // Update current impact position
      this.currentImpact = { x: cursorpt.x, y: cursorpt.y };
      event.preventDefault();
    }
  }

  endDrag() {
    if (this.moving && this.currentImpact) {
      this.newImpact.emit({ x: this.currentImpact.x, y: this.currentImpact.y });

      // Reset
      this.currentImpact = null;
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
