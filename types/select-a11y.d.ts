export class Select {
    /**
     * @param {HTMLSelectElement} el - Select HTML element
     * @param {object} [options] - options to control select-a11y behavior
     * @param {object} [options.text] - texts used in the class
     * @param {object} [options.text.help] - helper text used for assistive technologies
     * @param {object} [options.text.placeholder] - search input placeholder
     * @param {object} [options.text.noResult] - text shown when there is no option
     * @param {object} [options.text.results] - text to show the number of results available for assistive technologies
     * @param {object} [options.text.deleteItem] - text used as title for "x" close button for selected option (see options.showSelected below)
     * @param {object} [options.text.delete] - text used for assistive technologies for the "x" close button for selected option (see options.showSelected below)
     * @param {object} [options.text.clear] - text used for assistive technologies for the "x" clear button for clearable single select (see options.clearable below)
     * @param {FillSuggestions} [options.fillSuggestions] - fill suggestions based on search input content
     * @param {boolean} [options.showSelected=true] - show selected options for multiple select
     * @param {boolean} [options.useLabelAsButton=false] - use label as button even for single select.
     * Only work if select value is set to `null` otherwise its value defaults to first option.
     * @param {boolean} [options.clearable=false] - show clear icon for single select.
     * Only work if select value is set. It resets it to `null`.
     */
    constructor(el: HTMLSelectElement, options?: {
        text?: {
            help?: object;
            placeholder?: object;
            noResult?: object;
            results?: object;
            deleteItem?: object;
            delete?: object;
            clear?: object;
        };
        fillSuggestions?: (search: string, options: Array<HTMLOptionElement>) => Promise<{
            /**
             * - if suggestion is hidden
             */
            hidden: boolean;
            /**
             * - if suggestion is disabled
             */
            disabled: boolean;
            /**
             * - if suggestion is selected
             */
            selected: boolean;
            /**
             * - label shown
             */
            label: string;
            /**
             * - suggestion value
             */
            value: any;
            /**
             * - suggestion image
             */
            image?: string;
            /**
             * - suggestion image alt
             */
            alt?: string;
        }[]>;
        showSelected?: boolean;
        useLabelAsButton?: boolean;
        clearable?: boolean;
    });
    /** @type {HTMLSelectElement} */
    el: HTMLSelectElement;
    /** @type {HTMLLabelElement | null} */
    label: HTMLLabelElement | null;
    id: string;
    open: boolean;
    multiple: boolean;
    search: string;
    /** @type {Array<HTMLElement>} */
    suggestions: Array<HTMLElement>;
    focusIndex: any;
    _defaultSearch(search: string, options: Array<HTMLOptionElement>): Promise<{
        /**
         * - if suggestion is hidden
         */
        hidden: boolean;
        /**
         * - if suggestion is disabled
         */
        disabled: boolean;
        /**
         * - if suggestion is selected
         */
        selected: boolean;
        /**
         * - label shown
         */
        label: string;
        /**
         * - suggestion value
         */
        value: any;
        /**
         * - suggestion image
         */
        image?: string;
        /**
         * - suggestion image alt
         */
        alt?: string;
    }[]>;
    _options: {
        text: {
            help: string;
            placeholder: string;
            noResult: string;
            results: string;
            deleteItem: string;
            delete: string;
            clear: string;
        } & {
            help?: object;
            placeholder?: object;
            noResult?: object;
            results?: object;
            deleteItem?: object;
            delete?: object;
            clear?: object;
        };
        showSelected: boolean;
        fillSuggestions: (search: string, options: Array<HTMLOptionElement>) => Promise<{
            /**
             * - if suggestion is hidden
             */
            hidden: boolean;
            /**
             * - if suggestion is disabled
             */
            disabled: boolean;
            /**
             * - if suggestion is selected
             */
            selected: boolean;
            /**
             * - label shown
             */
            label: string;
            /**
             * - suggestion value
             */
            value: any;
            /**
             * - suggestion image
             */
            image?: string;
            /**
             * - suggestion image alt
             */
            alt?: string;
        }[]>;
        useLabelAsButton: boolean;
        clearable: boolean;
    } & {
        text?: {
            help?: object;
            placeholder?: object;
            noResult?: object;
            results?: object;
            deleteItem?: object;
            delete?: object;
            clear?: object;
        };
        fillSuggestions?: (search: string, options: Array<HTMLOptionElement>) => Promise<{
            /**
             * - if suggestion is hidden
             */
            hidden: boolean;
            /**
             * - if suggestion is disabled
             */
            disabled: boolean;
            /**
             * - if suggestion is selected
             */
            selected: boolean;
            /**
             * - label shown
             */
            label: string;
            /**
             * - suggestion value
             */
            value: any;
            /**
             * - suggestion image
             */
            image?: string;
            /**
             * - suggestion image alt
             */
            alt?: string;
        }[]>;
        showSelected?: boolean;
        useLabelAsButton?: boolean;
        clearable?: boolean;
    };
    _handleFocus(): void;
    _handleInput(): void;
    _handleKeyboard(event: any): void;
    _handleOpener(event: any): void;
    _handleClear(): void;
    _handleReset(): void;
    _handleSuggestionClick(event: any): void;
    _positionCursor(): void;
    _removeOption(event: any): void;
    /**
     * Update texts with new texts
     * @param {object} newText
     */
    setText(newText: object): void;
    _setButtonText(): void;
    /**
     * Select original options at initialization of the component.
     * They are never modified and are used to handle reset.
     * @type {Array<HTMLOptionElement>}
     */
    originalOptions: Array<HTMLOptionElement>;
    /**
     * Select original options at initialization of the component.
     * They are updated based on select / unselect of options but no options are added or removed to it.
     * This is the set of options passed to {@link FillSuggestions} callback.
     * @type {Array<HTMLOptionElement>}
     */
    updatedOriginalOptions: Array<HTMLOptionElement>;
    /**
     * Select current options. These can be completely differents options than {@link originalOptions}
     * if the provided promise fetches some from an API.
     * @type {Array<HTMLOptionElement>}
     */
    currentOptions: Array<HTMLOptionElement>;
    button: HTMLButtonElement;
    clearButton: HTMLButtonElement;
    liveZone: HTMLParagraphElement;
    overlay: HTMLDivElement;
    wrap: HTMLDivElement;
    selectedList: HTMLUListElement;
    /**
     * Select new value
     * @param {*} value option value
     */
    selectOption(value: any, dispatchEvent?: boolean): void;
    /**
     * Select new value without dispatching the change Event
     * @param {*} value option value
     */
    selectOptionSilently(value: any): void;
    _createButton(): HTMLButtonElement;
    _createClearButton(): HTMLButtonElement;
    _createLiveZone(): HTMLParagraphElement;
    _createOverlay(): HTMLDivElement;
    list: HTMLDivElement;
    /** @type {HTMLInputElement | null} */
    input: HTMLInputElement | null;
    _createSelectedList(): HTMLUListElement;
    _disable(): void;
    /**
     *
     * @typedef Suggestion
     * @property {boolean} hidden - if suggestion is hidden
     * @property {boolean} disabled - if suggestion is disabled
     * @property {boolean} selected - if suggestion is selected
     * @property {string} label - label shown
     * @property {any} value - suggestion value
     * @property {string} [image] - suggestion image
     * @property {string} [alt] - suggestion image alt
     */
    /**
     *
     * @param {HTMLOptionElement} option
     * @returns {Suggestion} - a suggestion
     */
    _mapToSuggestion(option: HTMLOptionElement): {
        /**
         * - if suggestion is hidden
         */
        hidden: boolean;
        /**
         * - if suggestion is disabled
         */
        disabled: boolean;
        /**
         * - if suggestion is selected
         */
        selected: boolean;
        /**
         * - label shown
         */
        label: string;
        /**
         * - suggestion value
         */
        value: any;
        /**
         * - suggestion image
         */
        image?: string;
        /**
         * - suggestion image alt
         */
        alt?: string;
    };
    /**
     *
     * @param {Suggestion} suggestion
     * @returns {HTMLOptionElement} - an option
     */
    _mapToOption(suggestion: {
        /**
         * - if suggestion is hidden
         */
        hidden: boolean;
        /**
         * - if suggestion is disabled
         */
        disabled: boolean;
        /**
         * - if suggestion is selected
         */
        selected: boolean;
        /**
         * - label shown
         */
        label: string;
        /**
         * - suggestion value
         */
        value: any;
        /**
         * - suggestion image
         */
        image?: string;
        /**
         * - suggestion image alt
         */
        alt?: string;
    }): HTMLOptionElement;
    /**
     *
     * @returns {Promise<Array<Suggestion>>}
     */
    _fillSuggestions(): Promise<{
        /**
         * - if suggestion is hidden
         */
        hidden: boolean;
        /**
         * - if suggestion is disabled
         */
        disabled: boolean;
        /**
         * - if suggestion is selected
         */
        selected: boolean;
        /**
         * - label shown
         */
        label: string;
        /**
         * - suggestion value
         */
        value: any;
        /**
         * - suggestion image
         */
        image?: string;
        /**
         * - suggestion image alt
         */
        alt?: string;
    }[]>;
    _focusTimeout: NodeJS.Timeout;
    _resetTimeout: NodeJS.Timeout;
    _moveIndex(step: any): void;
    _setLiveZone(): void;
    _toggleOverlay(state: any, focusBack: any): void;
    _toggleSelection(optionIndex: any, close?: boolean, dispatch?: boolean): void;
    _updateSelectedList(): void;
    _wrap(): HTMLDivElement;
}
export default Select;
//# sourceMappingURL=select-a11y.d.ts.map