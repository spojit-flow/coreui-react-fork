import PropTypes from 'prop-types';
import type { Placements, Triggers } from './types';
export declare const colorPropType: PropTypes.Requireable<string>;
export declare const fallbackPlacementsPropType: PropTypes.Requireable<NonNullable<Placements | NonNullable<Placements>[] | null>>;
export declare const gradientsPropType: PropTypes.Requireable<string>;
export declare const placementPropType: PropTypes.Requireable<Placements>;
export declare const shapePropType: PropTypes.Requireable<string>;
export declare const textColorsPropType: PropTypes.Requireable<string>;
export declare const triggerPropType: PropTypes.Requireable<NonNullable<Triggers | NonNullable<Triggers>[] | null | undefined>>;
