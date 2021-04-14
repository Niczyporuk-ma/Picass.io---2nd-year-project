import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { LassoHelperService } from './lasso-helper.service';
describe('LassoHelperService', () => {
    let service: LassoHelperService;
    let canvasTestHelper: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-magic-numbers
    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(LassoHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('detectIntersection should return true when there is an intersection', () => {
        const currentLine: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
        ];
        const intersection: boolean = service.detectIntersection(
            [
                { x: 10, y: 15 },
                { x: 25, y: 12 },
            ],
            currentLine,
        );
        expect(intersection).toBeTrue();
    });

    it('detectIntersection should return false when there is no intersection', () => {
        const currentLine: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
        ];
        const intersection: boolean = service.detectIntersection(
            [
                { x: 10, y: 15 },
                { x: 20, y: 16 },
            ],
            currentLine,
        );
        expect(intersection).toBeFalse();
    });

    it('detectIntersection should return false when a point intersect with itself', () => {
        const currentLine: Vec2[][] = [
            [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ],
        ];
        const intersection: boolean = service.detectIntersection(
            [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ],
            currentLine,
        );
        expect(intersection).toBeFalse();
    });

    it('isInsidePolygon should return true when a point is inside the polygon', () => {
        const currentLine: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
            [
                { x: 10, y: 15 },
                { x: 20, y: 15 },
            ],
        ];
        const isInside: boolean = service.isInsidePolygon({ x: 11, y: 11 }, currentLine);
        expect(isInside).toBeTrue();
    });

    it('isInsidePolygon should return false when a point is outside of the polygon', () => {
        const currentLine: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
            [
                { x: 10, y: 15 },
                { x: 20, y: 15 },
            ],
        ];
        const isInside: boolean = service.isInsidePolygon({ x: 30, y: 30 }, currentLine);
        expect(isInside).toBeFalse();
    });

    /*it('drawAnchorPoint should call arc of previewCtx 8 times', () => {
    let anchors : Vec2 [] = [];
    let path : Vec2[] = [{x:0,y:0},{x:100,y:100}];
    let arcSpy = spyOn(previewCtxStub,'arc');
    service.drawAnchorPoints(previewCtxStub,path,anchors);
    expect(arcSpy).toHaveBeenCalledTimes(8);
  });*/

    it('fix imageData should call isInsidePolygon', () => {
        const mockStartingPoint = { x: -50, y: -50 };
        const mockEndingPoint = { x: 1, y: 1 };
        const imageData = new ImageData(100, 100);
        const path: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
            [
                { x: 10, y: 15 },
                { x: 20, y: 15 },
            ],
        ];
        const polygonSpy = spyOn(service, 'isInsidePolygon');
        service.fixImageData(previewCtxStub, [mockStartingPoint, mockEndingPoint], imageData, path);
        expect(polygonSpy).toHaveBeenCalled();
    });

    it('clipRegion should call isInsidePolygon', () => {
        const path: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
            [
                { x: 10, y: 15 },
                { x: 20, y: 15 },
            ],
        ];
        const polygonSpy = spyOn(service, 'isInsidePolygon');
        service.clipRegion(previewCtxStub, path);
        expect(polygonSpy).toHaveBeenCalled();
    });

    it('updateRectangle should set currentLine to the max and min point of the path', () => {
        const path: Vec2[][] = [
            [
                { x: 20, y: 15 },
                { x: 20, y: 10 },
            ],
            [
                { x: 20, y: 10 },
                { x: 10, y: 10 },
            ],
            [
                { x: 10, y: 10 },
                { x: 10, y: 15 },
            ],
            [
                { x: 10, y: 15 },
                { x: 20, y: 15 },
            ],
        ];
        const currentLine: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];
        const height = 0;
        const width = 0;
        service.updateRectangle(path, currentLine, width, height);
        expect(currentLine[0]).toEqual({ x: 10, y: 10 });
        expect(currentLine[1]).toEqual({ x: 20, y: 15 });
    });
});
