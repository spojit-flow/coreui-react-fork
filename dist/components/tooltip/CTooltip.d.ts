import React, { HTMLAttributes, ReactNode } from 'react';
import type { Placements, Triggers } from '../../types';
export interface CTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
    /**
     * Apply a CSS fade transition to the tooltip.
     *
     * @since 4.9.0
     */
    animation?: boolean;
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Appends the react tooltip to a specific element. You can pass an HTML element or function that returns a single element. By default `document.body`.
     *
     * @since v4.11.0
     */
    container?: Element | (() => Element | null) | null;
    /**
     * Content node for your component.
     */
    content: ReactNode | string;
    /**
     * The delay for displaying and hiding the tooltip (in milliseconds). When a numerical value is provided, the delay applies to both the hide and show actions. The object structure for specifying the delay is as follows: delay: `{ 'show': 500, 'hide': 100 }`.
     *
     * @since 4.9.0
     */
    delay?: number | {
        show: number;
        hide: number;
    };
    /**
     * Specify the desired order of fallback placements by providing a list of placements as an array. The placements should be prioritized based on preference.
     *
     * @since 4.9.0
     */
    fallbackPlacements?: Placements | Placements[];
    /**
     * Offset of the tooltip relative to its target.
     */
    offset?: [number, number];
    /**
     * Callback fired when the component requests to be hidden.
     */
    onHide?: () => void;
    /**
     * Callback fired when the component requests to be shown.
     */
    onShow?: () => void;
    /**
     * Sets which event handlers you’d like provided to your toggle prop. You can specify one trigger or an array of them.
     *
     * @type 'hover' | 'focus' | 'click'
     */
    trigger?: Triggers | Triggers[];
    /**
     * Describes the placement of your component after Popper.js has applied all the modifiers that may have flipped or altered the originally provided placement property.
     */
    placement?: 'auto' | 'top' | 'right' | 'bottom' | 'left';
    /**
     * Toggle the visibility of tooltip component.
     */
    visible?: boolean;
}
export declare const CTooltip: React.ForwardRefExoticComponent<CTooltipProps & React.RefAttributes<HTMLDivElement>>;
