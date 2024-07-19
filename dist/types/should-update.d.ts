export declare const shouldUpdate: (lastKnownScrollY: number | undefined, currentScrollY: number | undefined, props: {
    pin?: boolean;
    pinStart: number;
    upTolerance: number;
    downTolerance: number;
}, state: {
    state: any;
    height?: number;
}) => {
    action: string;
    scrollDirection: string;
    distanceScrolled: number;
};
