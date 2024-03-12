import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { fireEvent, render, screen } from '@testing-library/react';
import Slider from './Slider';

const changeMock = jest.fn();
beforeEach(() => {
  render(
    <Slider min={0} max={100} value={50} onChange={changeMock} width="100%" />
  );
});

test('renders the slider component', () => {
  const sliderThumb = screen.getByRole('slider');
  expect(sliderThumb).toBeInTheDocument();
});

test('updates the slider value when clicked', async () => {
  const slider = screen.getByRole('slider');

  await userEvent.click(slider), { clientX: 100 };
  expect(changeMock).toHaveBeenCalled();
});

test('updates the slider value when moving thumb', async () => {
  const slider = screen.getByRole('slider');

  await fireEvent.mouseDown(slider, { clientX: 50 });
  await fireEvent.mouseMove(slider, { clientX: 100 });
  await fireEvent.mouseUp(slider);

  expect(changeMock).toHaveBeenCalled();
});
