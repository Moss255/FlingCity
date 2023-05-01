import { Point } from "@pixi/math"

export const distanceBetweenPoints = (a: Point, b: Point) => {    
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    );
}

export const getLaneXPosition = (screenWidth: number, line: number) => {
    return screenWidth / 3 * line + 55
}