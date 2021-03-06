import { McLeanRegressionLineInterface } from './../features/java/mclean-regression';
export interface JavaBridge {
    syncAxes(xMin: number, xMax: number, yMin: number, yMax: number): void;
    regression: {
        fitLineToDataFor2D(x: string, y: string, x1sigmaAbs: string, y1SigmaAbs: string, rhos: string): McLeanRegressionLineInterface;
        getAX(): number;
        getIntercept(): number;
        getVectorX(): number;
        getSlope(): number;
        getV(): string;
        getSav(): string;
    };
}
