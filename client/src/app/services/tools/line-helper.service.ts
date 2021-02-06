import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

const POSSIBLE_ANGLES: number[] = [0, 45, 90, 135, 180, 225, 270, 315];
const ANGLE_ADJUSTER_180 = 180;
const ANGLE_ADJUSTER_360 = 360;
const PIXEL_DISTANCE = 20;
const TO_RADIAN = Math.PI / 180;

@Injectable({
    providedIn: 'root',
})
export class LineHelperService {
    constructor() {}

    closestValidAngle(start: Vec2, end: Vec2): number {
        let closestValid = 999;

        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);
        angle = this.angleQuadrantConverter(start, end, angle);
        // console.log('current : ' + angle);
        for (const angles of POSSIBLE_ANGLES) {
            if (Math.abs(angle - angles) < Math.abs(angle - closestValid)) {
                closestValid = angles;
            }
        }

        return closestValid;
    }

    closestAngledPoint(start: Vec2, end: Vec2): Vec2 {
        const closestAngle: number = this.closestValidAngle(start, end);
        const currentVectorMagnitude: number = this.distanceUtil(start, end);
        const xCoord: number = start.x + currentVectorMagnitude * Math.cos(closestAngle * TO_RADIAN);
        const yCoord: number = start.y - currentVectorMagnitude * Math.sin(closestAngle * TO_RADIAN);
        const newLine: Vec2 = { x: xCoord, y: yCoord };

        return newLine;
    }

    distanceUtil(start: Vec2, end: Vec2): number {
        const a = Math.abs(start.x - end.x);
        const b = Math.abs(start.y - end.y);

        return Math.sqrt(a * a + b * b);
    }

    angleQuadrantConverter(start: Vec2, end: Vec2, angle: number): number {
        if (start.x <= end.x && start.y >= end.y) {
            angle = angle;
            return angle;
        } else if (start.x <= end.x && start.y <= end.y) {
            angle = ANGLE_ADJUSTER_360 - angle;
            return angle;
        } else if (start.x >= end.x && start.y >= end.y) {
            angle = ANGLE_ADJUSTER_180 - angle;
            return angle;
        } else {
            angle = angle + ANGLE_ADJUSTER_180;
            return angle;
        }
    }

    shiftAngleCalculator(start: Vec2, end: Vec2): boolean {
        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);

        angle = this.angleQuadrantConverter(start, end, angle);
        // console.log(angle);
        if (angle % 45 === 0) {
            // console.log('true');
            return true;
        } else {
            // console.log('false');
            return false;
        }
    }

    pixelDistanceUtil(start: Vec2, end: Vec2): boolean {
        const distanceHorizontale = Math.abs(start.x - end.x);
        const distanceVerticale = Math.abs(start.y - end.y);

        return distanceHorizontale <= PIXEL_DISTANCE && distanceVerticale <= PIXEL_DISTANCE;
    }
}
