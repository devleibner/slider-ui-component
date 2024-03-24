'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './Slider.module.css';

interface SliderProps {
  /* minimum value of the slider */
  min: number;
  /* maximum value of the slider */
  max: number;
  /** the current (default) value of the slider.
   *  notice that current value of the slider should always
   *  be greater than or equal to minimum value
   */
  value: number;
  /* callback function for onChange */
  onChange?: Dispatch<SetStateAction<number>>;
  /* the width of the slider */
  width: number | string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  width,
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentValue, setCurrentValue] = useState(value);
  const changeRef = useRef<Function>();
  changeRef.current = onChange;

  const percentage = useMemo(
    () => ((currentValue - min) / (max - min)) * 100,
    [currentValue, min, max]
  );

  const getPositionFromEvent = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return e.clientX;
  }, []);

  const updateValue = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      const { left, width } = sliderRef.current.getBoundingClientRect();
      const newValue = Math.min(
        max,
        Math.max(min, min + ((clientX - left) / width) * (max - min))
      );

      setCurrentValue(newValue);
    },
    [min, max]
  );

  const handleMove = useCallback(
    (e) => {
      const clientX = getPositionFromEvent(e);
      updateValue(clientX);
    },
    [updateValue, getPositionFromEvent]
  );

  const handleEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  }, [handleMove]);

  const handleStart = useCallback(
    (e) => {
      e.preventDefault();
      const clientX = getPositionFromEvent(e);
      updateValue(clientX);
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    },
    [updateValue, handleMove, handleEnd, getPositionFromEvent]
  );

  useEffect(() => {
    changeRef.current && changeRef.current(currentValue);
  }, [currentValue, changeRef]);

  return (
    <div
      ref={sliderRef}
      role="slider"
      aria-valuenow={currentValue}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className={styles.slider}
      style={{
        width,
      }}
    >
      <button
        className={styles.thumb}
        style={{
          left: `${percentage}%`,
        }}
      />
      <div
        className={styles.sliderBefore}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Slider;
