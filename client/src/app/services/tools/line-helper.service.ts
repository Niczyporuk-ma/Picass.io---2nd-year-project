import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

export const POSSIBLE_ANGLES: number[] = [0, 45, 90, 135, 180, 225, 270, 315, 360];
const ANGLE_ADJUSTER_180 = 180;
const ANGLE_ADJUSTER_360 = 360;
const PIXEL_DISTANCE = 20;
const TO_RADIAN = Math.PI / 180;
const BIG_NUMBER = 999;

@Injectable({
    providedIn: 'root',
})
export class LineHelperService {
    closestValidAngle(start: Vec2, end: Vec2): number {
        let closestValid = BIG_NUMBER;
        //a et b?
        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        //meilleur nom pour angle
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);
        console.log(angle);
        angle = this.angleQuadrantConverter(start, end, angle);
        //a enlever
        console.log(angle);
        for (const angles of POSSIBLE_ANGLES) {
            if (Math.abs(angle - angles) < Math.abs(angle - closestValid)) {
                closestValid = angles;
            }
        }

        return closestValid === 360 ? 0 : closestValid;
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
        //a et b?
        const a = Math.abs(start.x - end.x);
        const b = Math.abs(start.y - end.y);

        return Math.sqrt(a * a + b * b);
    }

    angleQuadrantConverter(start: Vec2, end: Vec2, angle: number): number {
        if (start.x <= end.x && start.y >= end.y) {
            //inutile
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
        //a et b?
        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);

        angle = this.angleQuadrantConverter(start, end, angle);
        return angle % 45 === 0;
    }

    pixelDistanceUtil(start: Vec2, end: Vec2): boolean {
        const distanceHorizontale = Math.abs(start.x - end.x);
        const distanceVerticale = Math.abs(start.y - end.y);

        return distanceHorizontale <= PIXEL_DISTANCE && distanceVerticale <= PIXEL_DISTANCE;
    }
}
