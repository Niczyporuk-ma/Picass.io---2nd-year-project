import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { SquareHelperService } from './square-helper.service';

describe('SquareHelperService', () => {
    let service: SquareHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SquareHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' checkIfIsSquare should return true', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 5, y: 1 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).toEqual(true);
    });

    it(' checkIfIsSquare should not detect a square', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 14, y: 20 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).not.toEqual(true);
    });

    it(' checkIfIsSquare detect a square when its a single point', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 1, y: 5 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).toEqual(true);
    });

    it(' closestSquare should find the closest square when the horizontal distance is the longest and when isLeft is false', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 6, y: 2 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 4, y: 2 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the horizontal distance is the longest and when isLeft is true', () => {
        let initialCoord: Vec2 = { x: 25, y: 20 };
        let endingCoord: Vec2 = { x: 10, y: 10 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 15, y: 10 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the vertical distance is the longest and when isDownWard is true', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 2, y: 2 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 2, y: 4 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the vertical distance is the longest and when isDownWard is false', () => {
        let initialCoord: Vec2 = { x: 20, y: 20 };
        let endingCoord: Vec2 = { x: 25, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 25, y: 25 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should return the initial point when the two point are on a horizontal line', () => {
        let initialCoord: Vec2 = { x: 20, y: 40 };
        let endingCoord: Vec2 = { x: 25, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 20, y: 40 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should return the initial point when the two point are on a vertical line', () => {
        let initialCoord: Vec2 = { x: 20, y: 99 };
        let endingCoord: Vec2 = { x: 20, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 20, y: 99 };
        expect(expectedPosition).toEqual(newPosition);
    });
});
