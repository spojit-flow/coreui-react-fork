import type { Option, OptionsGroup, SelectedOption } from './types';
export declare const createOption: (text: string, options: (Option | OptionsGroup)[]) => {
    value: string;
    text: string;
    custom: boolean;
}[];
export declare const filterOptionsList: (search: string, _options: (Option | OptionsGroup)[]) => any[];
export declare const flattenOptionsArray: (options: (Option | OptionsGroup)[], keepGroupLabel?: boolean) => (Option | OptionsGroup)[];
export declare const getNextSibling: (elem: HTMLElement, selector?: string) => Element | null | undefined;
export declare const getPreviousSibling: (elem: HTMLElement, selector?: string) => Element | null | undefined;
export declare const selectOptions: (options: (Option | OptionsGroup)[], selected: SelectedOption[], deselected?: Option[]) => SelectedOption[];
