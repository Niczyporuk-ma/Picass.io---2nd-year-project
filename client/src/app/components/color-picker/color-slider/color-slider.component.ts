import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})

@ViewChild('canvas')
canvas: ElementRef<HTMLCanvasElement>{};

export class ColorSliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
