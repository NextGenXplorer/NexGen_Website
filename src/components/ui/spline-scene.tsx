import React from "react";
import Spline from "@splinetool/react-spline";

type SplineSceneProps = {
  scene: string;
  className?: string;
};

export const SplineScene = ({ scene, className }: SplineSceneProps) => {
  return (
    <Spline
      scene={scene}
      className={className}
    />
  );
};
