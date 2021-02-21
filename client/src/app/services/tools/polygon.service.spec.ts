import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/enums/enums';
import { PolygonService } from './polygon.service';


fdescribe('PolygonService', () => {
  let service: PolygonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it( 'onMouseDown should set the startingPoint when mouseDown is true', () => {
    let mouseEvent :MouseEvent = {button : MouseButton.Left, offsetX : 0,offsetY:0} as MouseEvent;
    service.onMouseDown(mouseEvent);
    expect(service.startingPoint).toEqual({x: 0, y:0});
  });

  it('onMouseDown should not call getPositionFromMouse if mouseDown is false', () => {
    let mouseEvent :MouseEvent = {button : MouseButton.Right} as MouseEvent;
    const getMouseFromPositionSpy = spyOn(service,'getPositionFromMouse');
    service.onMouseDown(mouseEvent);
    expect(getMouseFromPositionSpy).not.toHaveBeenCalled();
  });

  it('onMouseUp should set the endPoint when mouseDown is true', () => {
    spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = true;
    service['drawingService'].resizeActive = false;
    service.onMouseUp(mouseEvent);
    expect(service.endPoint).toEqual({x: 120, y:14});
  });

  it('onMouseUp should call drawLine et clearCanvas when mouseDown is true', () => {
    const clearCanavsSpy = spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    const drawLineSpy = spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = true;
    service['drawingService'].resizeActive = false;
    service.onMouseUp(mouseEvent);
    expect(clearCanavsSpy).toHaveBeenCalled();
    expect(drawLineSpy).toHaveBeenCalled();

  });

  it('onMouseUp should notcall drawLine et clearCanvas when mouseDown is false', () => {
    const clearCanavsSpy = spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    const drawLineSpy = spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = false;
    service['drawingService'].resizeActive = false;
    service.onMouseUp(mouseEvent);
    expect(clearCanavsSpy).not.toHaveBeenCalled();
    expect(drawLineSpy).not.toHaveBeenCalled();

  });

  it('onMouseUp should always set mouseDown to false', () => {
    spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = true;
    service['drawingService'].resizeActive = false;
    service.onMouseUp(mouseEvent);
    expect(service.mouseDown).toEqual(false);

  });

  it('onMouseMove should set the endPoint when mouseDown is true', () => {
    spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = true;
    service['drawingService'].resizeActive = false;
    service.onMouseMove(mouseEvent);
    expect(service.endPoint).toEqual({x: 120, y:14});
  });

  it('onMouseMove should call drawLine et clearCanvas when mouseDown is true', () => {
    const clearCanavsSpy = spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    const drawLineSpy = spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = true;
    service['drawingService'].resizeActive = false;
    service.onMouseMove(mouseEvent);
    expect(clearCanavsSpy).toHaveBeenCalled();
    expect(drawLineSpy).toHaveBeenCalled();

  });

  it('onMouseMove should notcall drawLine et clearCanvas when mouseDown is false', () => {
    const clearCanavsSpy = spyOn(service['drawingService'],'clearCanvas').and.returnValue();
    const drawLineSpy = spyOn(service,'drawLine').and.returnValue();
    let mouseEvent :MouseEvent = {offsetX : 120,offsetY:14} as MouseEvent;
    service.mouseDown = false;
    service['drawingService'].resizeActive = false;
    service.onMouseMove(mouseEvent);
    expect(clearCanavsSpy).not.toHaveBeenCalled();
    expect(drawLineSpy).not.toHaveBeenCalled();

  });

 /* it('drawLine should set the strokeStyle and fillStyle of both preview and base canvas', () => {
    const canvasSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
        'moveTo',
        'beginPath',
        'lineTo',
        'stroke',
        'fillStyle',
        'strokeStyle'
    ]);

    service.drawLine(canvasSpyObject,[{x:120,y:40},{x:0,y:0}]);
    
   
});*/


  it('clearArray should empty currentLine', () => {
    service.clearArrays();
    expect(service.currentLine).toEqual([]);
  });


});
