
import {
  IconMapSearch, IconX
} from '@tabler/icons-react';
import {
  motion, Variants
} from 'framer-motion';
import React, {
  Dispatch, SetStateAction, useEffect, useRef, useState
} from 'react';
import scrollToSelected, { handleInteractiveKeyDown } from '../../../../helpers/inputs';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import styles from './autocomplete.module.scss';
import { useWindowSize } from '../../../../hooks/use-window';

interface InputTextProps<T = any> {
  name:string
  placeholder?: string,
  value: T;
  setCurrentValue?: Dispatch<SetStateAction<T>>;
  onChangeText: Dispatch<SetStateAction<string>>;
  valueText: string
  onScroll?: (ref:any) => void
  items: T[]
  itemLabel?: string
}

export const variantsAutocomplete: Variants = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 10px)',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05
    }
  },
  closed: {
    clipPath: 'inset(10% 50% 90% 50% round 10px)',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.3
    }
  }
};

export const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

export const AutoComplete: React.FC<InputTextProps> = ({
  name,
  placeholder,
  setCurrentValue,
  value: currentValue,
  onChangeText,
  valueText,
  onScroll,
  items: itemsList,
  itemLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<any>(null);
  const [hoverItem, setHoverItem] = useState<any>(null);
  const optionsRef = useRef<any>(null);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  const portalContainer = document.getElementById('portal-root');

  const { width: widthScreen } = useWindowSize();

  const onReziseScreen = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();

      setPopoverPosition({
        width: rect.width,
        top: rect.bottom,
        left: rect.left,
        height:
          window.innerHeight - rect.bottom > 128 ? null : window.innerHeight - rect.bottom - 16
      });
    }
  };

  useEffect(() => {
    scrollToSelected({ optionsRef });
  }, [isOpen, hoverItem]);

  useEffect(() => {
    setHoverItem(currentValue);
    onReziseScreen();
  }, [widthScreen, isOpen]);

  const handleInteractiveKeyDownData = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleInteractiveKeyDown({
      e,
      isOpen,
      setIsOpen,
      onReziseScreen,
      hoverItem,
      setHoverItem,
      handleOptionClick,
      optionSelect: currentValue,
      optionElements: itemsList
    });
  };

  const handleOptionClick = (
    option: any,
    id?: string
  ) => {
    setIsOpen(false);
    setHoverItem(option);
    setCurrentValue(option);
  };

  return (
    <>
      <motion.div className={styles.content} ref={selectRef} animate={isOpen ? 'open' : 'closed'} onKeyDown={e => handleInteractiveKeyDownData(e)} >
        <div>
          <IconMapSearch role='icon-search-map' stroke={1.5} className={styles.icon_search} />
          <IconX role='icon-clear' stroke={1.5} className={styles.icon_delete} onClick={() => onChangeText('')} />
          <motion.input
            onClick={() => setIsOpen(!isOpen)}
            name={name}
            className={`${ styles.input }`}
            type={'text'}
            onChange={e => {
              setIsOpen(true);
              onChangeText(e.target.value);
            }}
            value={valueText}
            placeholder={placeholder}
            ref={dropdownRef}
          />
        </div>
        {
          ReactDOM.createPortal(
            <motion.ul
              className={styles.dropdown_options}
              style={{
                width: popoverPosition.width,
                top: popoverPosition.top,
                left: popoverPosition.left,
                height: popoverPosition.height,
                pointerEvents: isOpen ? 'auto' : 'none'
              }}
              ref={optionsRef}
              variants={variantsAutocomplete}
              onScroll={() => onScroll(optionsRef)}
            >
              {
                itemsList.map((item, index) => (
                  <motion.li
                    key={'list-autocomplete-' + index}
                    variants={itemVariants}
                    className={
                      `option ${ styles.dropdown_option } ${ _.isEqual(currentValue, item) ? styles.selected : '' } ${ _.isEqual(item, hoverItem) ? `selectedHover ${ styles.currentHover }` : '' }`
                    }
                    onClick={() => {
                      handleOptionClick(item);
                    }}
                  >
                    {item[itemLabel]}
                  </motion.li>
                ))
              }
            </motion.ul>,
            portalContainer
          )
        }
      </motion.div>
    </>
  );
};
