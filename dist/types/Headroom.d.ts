import React from "react";
type HeadroomProps = {
    children: React.ReactNode;
    pin?: boolean;
    upTolerance?: number;
    downTolerance?: number;
    pinStart?: number;
    style?: React.CSSProperties;
    onUnpin?: () => void;
    onUnfix?: () => void;
};
export declare const Headroom: (headroomProps: HeadroomProps) => React.JSX.Element;
export {};
