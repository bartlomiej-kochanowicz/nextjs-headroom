

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { shouldUpdate } from "./should-update";

type HeadroomProps = {
  children: React.ReactNode;
  pin?: boolean;
  upTolerance?: number;
  downTolerance?: number;
  pinStart?: number;
  style?: React.CSSProperties;
  onPin?: () => void;
  onUnpin?: () => void;
  onUnfix?: () => void;
};

export const Headroom = (headroomProps: HeadroomProps) => {
  const props = useMemo(
    () => ({
      ...headroomProps,
      pin: false,
      upTolerance: 5,
      downTolerance: 0,
      pinStart: 0,
    }),
    [headroomProps],
  );

  const currentScrollY = useRef(0);
  const lastKnownScrollY = useRef(0);
  const scrollTicking = useRef(false);
  const resizeTicking = useRef(false);
  const inner = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<{
    state: string;
    translateY: number | string;
    height?: number;
    animation: boolean;
  }>({
    state: "unfixed",
    translateY: 0,
    animation: false,
  });

  const setHeightOffset = () => {
    setState((prev) => ({
      ...prev,
      height: inner.current ? inner.current.offsetHeight : 0,
    }));

    resizeTicking.current = false;
  };

  useEffect(() => {
    setHeightOffset();
  }, []);

  const getScrollY = () => {
    if (window.scrollY !== undefined) {
      return window.scrollY;
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }
  };

  const getViewportHeight = useCallback(
    () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    [],
  );

  const getDocumentHeight = useCallback(() => {
    const body = document.body;
    const documentElement = document.documentElement;

    return Math.max(
      body.scrollHeight,
      documentElement.scrollHeight,
      body.offsetHeight,
      documentElement.offsetHeight,
      body.clientHeight,
      documentElement.clientHeight,
    );
  }, []);

  const isOutOfBound = useCallback(
    (currentScrollY: number) => {
      const pastTop = currentScrollY < 0;

      const scrollerPhysicalHeight = getViewportHeight();
      const scrollerHeight = getDocumentHeight();

      const pastBottom = currentScrollY + scrollerPhysicalHeight > scrollerHeight;

      return pastTop || pastBottom;
    },
    [getDocumentHeight, getViewportHeight],
  );

  const pin = () => {
    props.onPin?.();

    setState((prev) => ({
      ...prev,
      translateY: 0,
      animation: true,
      state: "pinned",
    }));
  };

  const unpin = useCallback(() => {
    props.onUnpin?.();

    setState((prev) => ({
      ...prev,
      translateY: "-100%",
      animation: true,
      state: "unpinned",
    }));
  }, [props]);

  const unpinSnap = () => {
    setState((prev) => ({
      ...prev,
      translateY: "-100%",
      animation: false,
      state: "unpinned",
    }));
  };

  const unfix = useCallback(() => {
    props.onUnfix?.();
    setState((prev) => ({
      ...prev,
      translateY: 0,
      animation: false,
    }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, state: "unfixed" }));
    }, 0);
  }, [props]);

  const update = useCallback(() => {
    currentScrollY.current = getScrollY();

    if (!isOutOfBound(currentScrollY.current)) {
      const { action } = shouldUpdate(
        lastKnownScrollY.current,
        currentScrollY.current,
        props,
        state,
      );

      if (action === "pin") {
        pin();
      } else if (action === "unpin") {
        unpin();
      } else if (action === "unpin-snap") {
        unpinSnap();
      } else if (action === "unfix") {
        unfix();
      }
    }

    lastKnownScrollY.current = currentScrollY.current;
    scrollTicking.current = false;
  }, [isOutOfBound, props, state, unfix, unpin]);

  const handleScroll = useCallback(() => {
    if (!scrollTicking.current) {
      scrollTicking.current = true;
      update();
    }
  }, [update]);

  const handleResize = useCallback(() => {
    if (!resizeTicking.current) {
      resizeTicking.current = true;
      setHeightOffset();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  let innerStyle: Record<string, string | number | undefined> = {
    position: (state.state === "unfixed" ? "relative" : "fixed"),
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    WebkitTransform: `translate3D(0, ${state.translateY}, 0)`,
    MsTransform: `translate3D(0, ${state.translateY}, 0)`,
    transform: `translate3D(0, ${state.translateY}, 0)`,
  };

  if (state.animation) {
    innerStyle = {
      ...innerStyle,
      WebkitTransition: "all .2s ease-in-out",
      MozTransition: "all .2s ease-in-out",
      OTransition: "all .2s ease-in-out",
      transition: "all .2s ease-in-out",
    };
  }

  return (
    <div
      style={{
        ...props.style,
        height: state.height,
      }}
    >
      <div ref={inner} style={innerStyle}>
        {props.children}
      </div>
    </div>
  );
};

