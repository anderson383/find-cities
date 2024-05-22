import React, {MutableRefObject} from 'react';
import _ from 'lodash';

interface HandleInteractiveKeyDownParams<T> {
  e: React.KeyboardEvent<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onReziseScreen: () => void;
  hoverItem: T;
  setHoverItem: (item: T) => void;
  handleOptionClick: (item: T) => void;
  optionSelect: T;
  optionElements: any;
}

export const handleInteractiveKeyDown = <T, >({
  e,
  isOpen,
  setIsOpen,
  onReziseScreen,
  hoverItem,
  setHoverItem,
  handleOptionClick,
  optionSelect,
  optionElements
}: HandleInteractiveKeyDownParams<T>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    setIsOpen(!isOpen);
    onReziseScreen();
  }
  if (isOpen) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const filteredOptions = Array.from(optionElements || []).map(el => ((el as any)));
      const currentIndex = Array.from(filteredOptions || []).findIndex(element => _.isEqual(element, hoverItem));
      const nextIndex
        = e.key === 'ArrowDown'
          ? Math.min(currentIndex + 1, filteredOptions.length - 1)
          : Math.max(currentIndex - 1, 0);

      setHoverItem(filteredOptions[nextIndex]);
    }
    if (e.key === 'Enter') {
      if (hoverItem) {
        handleOptionClick(hoverItem);
      }
      if (_.isEqual(hoverItem, optionSelect)) {
        handleOptionClick(hoverItem);
      }
    }
  }
};

interface ScrollToSelectedParams {
  optionsRef: MutableRefObject<HTMLDivElement | null>;
}

const scrollToSelected = ({ optionsRef }: ScrollToSelectedParams) => {
  if (optionsRef.current) {
    const selectedElement = optionsRef.current.querySelector('.selectedHover');

    if (selectedElement) {
      const popoverHeight = optionsRef.current.clientHeight;
      const selectedElementOffset = (selectedElement as any).offsetTop;
      const selectedElementHeight = selectedElement.clientHeight;
      const scrollPosition
        = selectedElementOffset - popoverHeight / 2 + selectedElementHeight / 2;

      optionsRef.current.scrollTop = scrollPosition;
    }
  }
};

export default scrollToSelected;
