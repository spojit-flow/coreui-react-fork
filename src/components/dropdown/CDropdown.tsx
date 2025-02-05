import React, {
  createContext,
  ElementType,
  forwardRef,
  HTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { useForkedRef, usePopper } from '../../hooks'
import { placementPropType } from '../../props'
import type { Placements } from '../../types'
import { isRTL } from '../../utils'

export type Directions = 'start' | 'end'

export type Breakpoints =
  | { xs: Directions }
  | { sm: Directions }
  | { md: Directions }
  | { lg: Directions }
  | { xl: Directions }
  | { xxl: Directions }

export type Alignments = Directions | Breakpoints

export interface CDropdownProps extends HTMLAttributes<HTMLDivElement | HTMLLIElement> {
  /**
   * Set aligment of dropdown menu.
   *
   * @type 'start' | 'end' | { xs: 'start' | 'end' } | { sm: 'start' | 'end' } | { md: 'start' | 'end' } | { lg: 'start' | 'end' } | { xl: 'start' | 'end'} | { xxl: 'start' | 'end'}
   */
  alignment?: Alignments
  /**
   * Configure the auto close behavior of the dropdown:
   * - `true` - the dropdown will be closed by clicking outside or inside the dropdown menu.
   * - `false` - the dropdown will be closed by clicking the toggle button and manually calling hide or toggle method. (Also will not be closed by pressing esc key)
   * - `'inside'` - the dropdown will be closed (only) by clicking inside the dropdown menu.
   * - `'outside'` - the dropdown will be closed (only) by clicking outside the dropdown menu.
   */
  autoClose?: 'inside' | 'outside' | boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Appends the react dropdown menu to a specific element. You can pass an HTML element or function that returns a single element. By default `document.body`.
   *
   * @since v4.11.0
   */
  container?: Element | (() => Element | null) | null
  /**
   * Sets a darker color scheme to match a dark navbar.
   */
  dark?: boolean
  /**
   * Sets a specified  direction and location of the dropdown menu.
   */
  direction?: 'center' | 'dropup' | 'dropup-center' | 'dropend' | 'dropstart'
  /**
   * Offset of the dropdown menu relative to its target.
   */
  offset?: [number, number]
  /**
   * Callback fired when the component requests to be hidden.
   *
   * @since 4.9.0
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Describes the placement of your component after Popper.js has applied all the modifiers that may have flipped or altered the originally provided placement property.
   *
   * @type 'auto' | 'top-end' | 'top' | 'top-start' | 'bottom-end' | 'bottom' | 'bottom-start' | 'right-start' | 'right' | 'right-end' | 'left-start' | 'left' | 'left-end'
   */
  placement?: Placements
  /**
   * If you want to disable dynamic positioning set this property to `true`.
   */
  popper?: boolean
  /**
   * Generates dropdown menu using createPortal.
   *
   * @since 4.8.0
   */
  portal?: boolean
  /**
   * Set the dropdown variant to an btn-group, dropdown, input-group, and nav-item.
   */
  variant?: 'btn-group' | 'dropdown' | 'input-group' | 'nav-item'
  /**
   * Toggle the visibility of dropdown menu component.
   */
  visible?: boolean
}

interface ContextProps extends CDropdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropdownToggleRef: RefObject<any | undefined>
  dropdownMenuRef: RefObject<HTMLDivElement | HTMLUListElement | undefined>
  setVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>
  portal: boolean
}

const getPlacement = (
  placement: Placements,
  direction: CDropdownProps['direction'],
  alignment: CDropdownProps['alignment'],
  isRTL: boolean,
): Placements => {
  let _placement = placement

  if (direction === 'dropup') {
    _placement = isRTL ? 'top-end' : 'top-start'
  }

  if (direction === 'dropup-center') {
    _placement = 'top'
  }

  if (direction === 'dropend') {
    _placement = isRTL ? 'left-start' : 'right-start'
  }

  if (direction === 'dropstart') {
    _placement = isRTL ? 'right-start' : 'left-start'
  }

  if (alignment === 'end') {
    _placement = isRTL ? 'bottom-start' : 'bottom-end'
  }

  return _placement
}

export const CDropdownContext = createContext({} as ContextProps)

export const CDropdown = forwardRef<HTMLDivElement | HTMLLIElement, CDropdownProps>(
  (
    {
      children,
      alignment,
      autoClose = true,
      className,
      container,
      dark,
      direction,
      offset = [0, 2],
      onHide,
      onShow,
      placement = 'bottom-start',
      popper = true,
      portal = false,
      variant = 'btn-group',
      component = 'div',
      visible = false,
      ...rest
    },
    ref,
  ) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropdownToggleRef = useRef<any>(null)
    const dropdownMenuRef = useRef<HTMLDivElement | HTMLUListElement>(null)
    const forkedRef = useForkedRef(ref, dropdownRef)
    const [_visible, setVisible] = useState(visible)
    const { initPopper, destroyPopper } = usePopper()

    const Component = variant === 'nav-item' ? 'li' : component

    // Disable popper if responsive aligment is set.
    if (typeof alignment === 'object') {
      popper = false
    }

    const contextValues = {
      alignment,
      container,
      dark,
      dropdownToggleRef,
      dropdownMenuRef,
      popper,
      portal,
      variant,
      visible: _visible,
      setVisible,
    }

    const popperConfig = {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: offset,
          },
        },
      ],
      placement: getPlacement(placement, direction, alignment, isRTL(dropdownMenuRef.current)),
    }

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    useEffect(() => {
      if (_visible && dropdownToggleRef.current && dropdownMenuRef.current) {
        popper && initPopper(dropdownToggleRef.current, dropdownMenuRef.current, popperConfig)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('keyup', handleKeyup)
        onShow && onShow()
      }

      return () => {
        popper && destroyPopper()
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('keyup', handleKeyup)
        onHide && onHide()
      }
    }, [_visible])

    const handleKeyup = (event: KeyboardEvent) => {
      if (autoClose === false) {
        return
      }

      if (event.key === 'Escape') {
        setVisible(false)
      }
    }

    const handleMouseUp = (event: Event) => {
      if (!dropdownToggleRef.current || !dropdownMenuRef.current) {
        return
      }

      if (dropdownToggleRef.current.contains(event.target as HTMLElement)) {
        return
      }

      if (
        autoClose === true ||
        (autoClose === 'inside' && dropdownMenuRef.current.contains(event.target as HTMLElement)) ||
        (autoClose === 'outside' && !dropdownMenuRef.current.contains(event.target as HTMLElement))
      ) {
        setTimeout(() => setVisible(false), 1)
        return
      }
    }

    return (
      <CDropdownContext.Provider value={contextValues}>
        {variant === 'input-group' ? (
          <>{children}</>
        ) : (
          <Component
            className={classNames(
              variant === 'nav-item' ? 'nav-item dropdown' : variant,
              {
                'dropdown-center': direction === 'center',
                'dropup dropup-center': direction === 'dropup-center',
                [`${direction}`]:
                  direction && direction !== 'center' && direction !== 'dropup-center',
                show: _visible,
              },
              className,
            )}
            {...rest}
            ref={forkedRef}
          >
            {children}
          </Component>
        )}
      </CDropdownContext.Provider>
    )
  },
)

const alignmentDirection = PropTypes.oneOf<Directions>(['start', 'end'])

CDropdown.propTypes = {
  alignment: PropTypes.oneOfType([
    alignmentDirection,
    PropTypes.shape({ xs: alignmentDirection.isRequired }),
    PropTypes.shape({ sm: alignmentDirection.isRequired }),
    PropTypes.shape({ md: alignmentDirection.isRequired }),
    PropTypes.shape({ lg: alignmentDirection.isRequired }),
    PropTypes.shape({ xl: alignmentDirection.isRequired }),
    PropTypes.shape({ xxl: alignmentDirection.isRequired }),
  ]),
  autoClose: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf<'inside' | 'outside'>(['inside', 'outside']),
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  dark: PropTypes.bool,
  direction: PropTypes.oneOf(['center', 'dropup', 'dropup-center', 'dropend', 'dropstart']),
  offset: PropTypes.any, // TODO: find good proptype
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  placement: placementPropType,
  popper: PropTypes.bool,
  portal: PropTypes.bool,
  variant: PropTypes.oneOf(['btn-group', 'dropdown', 'input-group', 'nav-item']),
  visible: PropTypes.bool,
}

CDropdown.displayName = 'CDropdown'
