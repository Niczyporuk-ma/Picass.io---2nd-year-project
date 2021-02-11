import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { LineHelperService, POSSIBLE_ANGLES } from './line-helper.service';

fdescribe('LineHelperService', () => {
    let service: LineHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('closestValidAngle should the right closest angle', () => {
        const mockStartingPoint: Vec2 = { x: 0, y: 0 };
        let mockEndingPoints: Vec2[] = [
            { x: 5, y: -1 },
            { x: 5, y: -3.5 },
            { x: 1, y: -5 },
            { x: -3, y: -5 },
            { x: -5, y: -1 },
            { x: -3, y: 5 },
            { x: -1, y: 5 },
            { x: 3, y: 5 },
        ];

        for (let [index, mockEndingPoint] of mockEndingPoints.entries()) {
            expect(service.closestValidAngle(mockStartingPoint, mockEndingPoint)).toEqual(POSSIBLE_ANGLES[index]);
        }
    });

    it('closestValidAngle should return 0 if the closes angle is 360', () => {
        const mockStartingPoint: Vec2 = { x: 0, y: 0 };
        const mockEndingPoint: Vec2 = { x: 5, y: 1 };

        expect(service.closestValidAngle(mockStartingPoint, mockEndingPoint)).toEqual(0);
    });

    it('closestAngledPoint should return the right points', () => {
        const SQRT2_OVER2 = Math.sqrt(2) / 2;
        const mockStartingPoint: Vec2 = { x: 0, y: 0 };
        const mockEndingPoint: Vec2[] = [
            { x: 1, y: -0.1 },
            { x: SQRT2_OVER2, y: -0.6 },
            { x: 0, y: 0.9 },
            { x: -SQRT2_OVER2, y: -0.6 },
            { x: -1, y: -0.1 },
            { x: -SQRT2_OVER2, y: 0.6 },
            { x: -0.1, y: 1 },
            { x: SQRT2_OVER2, y: 0.6 },
        ];
        const expectedResults: Vec2[] = [
            { x: 1, y: 0 },
            { x: SQRT2_OVER2, y: -SQRT2_OVER2 },
            { x: 0, y: 1 },
            { x: -SQRT2_OVER2, y: -SQRT2_OVER2 },
            { x: -1, y: 0 },
            { x: -SQRT2_OVER2, y: SQRT2_OVER2 },
            { x: 0, y: 1 },
            { x: SQRT2_OVER2, y: SQRT2_OVER2 },
        ];

        for (let [index, point] of mockEndingPoint.entries()) {
            expect(service.closestAngledPoint(mockStartingPoint, point).x).toBeCloseTo(expectedResults[index].x, 0.1);
            expect(service.closestAngledPoint(mockStartingPoint, point).y).toBeCloseTo(expectedResults[index].y, 0.1);
        }
    });
});
