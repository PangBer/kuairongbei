import { useEffect, useRef } from "react";

function useOnceWhenValueReady(value: any, callback: (v: any) => void) {
  const hasRun = useRef(false);

  useEffect(() => {
    // 当 value 第一次有值时执行一次
    if (!hasRun.current && value !== undefined && value !== null) {
      hasRun.current = true;
      callback(value);
    }
  }, [value]);
}

export default useOnceWhenValueReady;
