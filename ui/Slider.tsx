'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    const newValue = Math.min(
      max,
      Math.max(min, min + ((clientX - left) / width) * (max - min))
    );

    setCurrentValue(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    updateValue(e.clientX);
    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    onChange && onChange(currentValue);
  }, [currentValue]);

  return (
    <div
      ref={sliderRef}
      role="slider"
      onMouseDown={handleMouseDown}
      className={styles.slider}
      style={{
        width,
      }}
    >
      <div
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
