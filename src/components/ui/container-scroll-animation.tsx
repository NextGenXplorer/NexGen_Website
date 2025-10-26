"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const scaleDimensions = () => {
    if (screenSize === 'mobile') return [0.6, 0.85];
    if (screenSize === 'tablet') return [0.75, 0.92];
    return [1.05, 1];
  };

  const rotateDimensions = () => {
    if (screenSize === 'mobile') return [15, 0];
    if (screenSize === 'tablet') return [18, 0];
    return [20, 0];
  };

  const translateDimensions = () => {
    if (screenSize === 'mobile') return [0, -50];
    if (screenSize === 'tablet') return [0, -75];
    return [0, -100];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], rotateDimensions());
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], translateDimensions());

  return (
    <div
      className="min-h-[50rem] sm:min-h-[60rem] md:min-h-[70rem] lg:min-h-[80rem] flex items-center justify-center relative p-2 sm:p-4 md:p-8 lg:p-12 xl:p-20"
      ref={containerRef}
    >
      <div
        className="py-6 sm:py-10 md:py-20 lg:py-32 xl:py-40 w-full relative px-2 sm:px-4"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-2 sm:px-4"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-7xl -mt-6 sm:-mt-8 md:-mt-12 mx-auto h-[25rem] sm:h-[30rem] md:h-[35rem] lg:h-[40rem] xl:h-[45rem] w-[95%] sm:w-[90%] md:w-full border-2 sm:border-3 md:border-4 border-[#6C6C6C] p-1 sm:p-2 md:p-4 lg:p-6 bg-[#222222] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-2 sm:p-3 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
