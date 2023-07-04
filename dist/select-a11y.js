const u = {
  help: "Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions",
  placeholder: "Rechercher dans la liste",
  noResult: "Aucun résultat",
  results: "{x} suggestion(s) disponibles",
  deleteItem: "Supprimer {t}",
  delete: "Supprimer",
  clear: "Vider"
}, c = Element.prototype.matches;
let o = Element.prototype.closest;
o || (o = function(r) {
  var e = this;
  do {
    if (c.call(e, r))
      return e;
    e = e.parentElement || e.parentNode;
  } while (e !== null && e.nodeType === 1);
  return null;
});
const p = !0, f = !1;
function d(r) {
  return (
    /** @type {Array<T>} */
    Array.from(r).map((e) => e.cloneNode(p))
  );
}
class m {
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
  constructor(e, t) {
    var l;
    this.el = e, this.label = document.querySelector(`label[for=${e.id}]`), this.id = e.id, this.open = !1, this.multiple = this.el.multiple, this.search = "", this.suggestions = [], this.focusIndex = null;
    const i = Object.assign({}, t), s = Object.assign({}, u, i.text);
    if (delete i.text, this._defaultSearch = this._defaultSearch.bind(this), this._options = Object.assign({
      text: s,
      showSelected: !0,
      fillSuggestions: this._defaultSearch,
      useLabelAsButton: !1,
      clearable: !1
    }, i), this._handleFocus = this._handleFocus.bind(this), this._handleInput = this._handleInput.bind(this), this._handleKeyboard = this._handleKeyboard.bind(this), this._handleOpener = this._handleOpener.bind(this), this._handleClear = this._handleClear.bind(this), this._handleReset = this._handleReset.bind(this), this._handleSuggestionClick = this._handleSuggestionClick.bind(this), this._positionCursor = this._positionCursor.bind(this), this._removeOption = this._removeOption.bind(this), this.setText = this.setText.bind(this), this._setButtonText = this._setButtonText.bind(this), !this.multiple) {
      const a = Array.from(this.el.options).some((n) => n.selected);
      if (this._options.useLabelAsButton && !a) {
        const n = document.createElement("option");
        n.innerText = ((l = this.label) == null ? void 0 : l.innerText) ?? "", n.setAttribute("value", ""), n.setAttribute("selected", "selected"), n.setAttribute("disabled", "disabled"), n.setAttribute("hidden", "hidden"), this.el.options.add(n, 0);
      }
    }
    this.originalOptions = d(this.el.options), this.updatedOriginalOptions = Array.from(this.el.options), this.currentOptions = Array.from(this.el.options), this._disable(), this.button = this._createButton(), this._setButtonText(), this.clearButton = this._createClearButton(), this.liveZone = this._createLiveZone(), this.overlay = this._createOverlay(), this.wrap = this._wrap(), this.multiple && this._options.showSelected && (this.selectedList = this._createSelectedList(), this._updateSelectedList(), this.selectedList.addEventListener("click", this._removeOption)), this.button.addEventListener("click", this._handleOpener), this.clearButton.addEventListener("click", this._handleClear), this.wrap.addEventListener("keydown", this._handleKeyboard), document.addEventListener("blur", this._handleFocus, !0), this.el.form && this.el.form.addEventListener("reset", this._handleReset);
  }
  /**
   * Update texts with new texts
   * @param {object} newText
   */
  setText(e) {
    Object.assign(this._options.text, e);
  }
  /**
   * Select new value
   * @param {*} value option value
   */
  selectOption(e, t = !0) {
    const i = this.currentOptions.findIndex((l) => l.value === e);
    if (i === -1)
      return;
    const s = !this.multiple;
    this._toggleSelection(i, s, t);
  }
  /**
   * Select new value without dispatching the change Event
   * @param {*} value option value
   */
  selectOptionSilently(e) {
    this.selectOption(e, f);
  }
  _createButton() {
    var i, s;
    const e = document.createElement("button");
    e.setAttribute("type", "button"), e.setAttribute("aria-expanded", this.open ? "true" : "false"), e.className = "select-a11y-button";
    const t = document.createElement("span");
    return t.className = "select-a11y-button__text", this.multiple ? t.innerText = ((i = this.label) == null ? void 0 : i.innerText) ?? "" : (this.label && !this.label.id && (this.label.id = `${this.el.id}-label`), e.setAttribute("id", this.el.id + "-button"), e.setAttribute("aria-labelledby", ((s = this.label) == null ? void 0 : s.id) + " " + e.id), t.innerHTML = "&nbsp;"), e.appendChild(t), e.insertAdjacentHTML("beforeend", '<span class="select-a11y-button__icon" aria-hidden="true"></span>'), e;
  }
  _createClearButton() {
    const e = document.createElement("button");
    return e.setAttribute("type", "button"), e.setAttribute("aria-label", this._options.text.clear), e.className = "select-a11y-button__clear", e;
  }
  _createLiveZone() {
    const e = document.createElement("p");
    return e.setAttribute("aria-live", "polite"), e.classList.add("sr-only"), e;
  }
  _createOverlay() {
    const e = document.createElement("div");
    e.classList.add("select-a11y__overlay");
    const t = document.createElement("div");
    return t.classList.add("select-a11y-suggestions"), t.id = `a11y-${this.id}-suggestions`, e.innerHTML = `
      <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
      <label for="a11y-${this.id}-js" class="sr-only">${this._options.text.placeholder}</label>
      <input type="search" id="a11y-${this.id}-js" class="select-a11y__input ${this.el.className}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${this._options.text.placeholder}" aria-describedby="a11y-usage-${this.id}-js">
    `, e.appendChild(t), this.list = t, this.list.addEventListener("click", this._handleSuggestionClick), this.input = e.querySelector("input"), this.input && (this.input.addEventListener("input", this._handleInput), this.input.addEventListener("focus", this._positionCursor, !0)), e;
  }
  _createSelectedList() {
    const e = document.createElement("ul");
    return e.className = "select-a11y__selected-list", e;
  }
  _disable() {
    this.el.setAttribute("tabindex", "-1");
  }
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
  _mapToSuggestion(e) {
    return {
      hidden: e.hidden,
      disabled: e.disabled,
      selected: e.hasAttribute("selected"),
      label: e.label,
      value: e.value,
      image: e.dataset.image,
      alt: e.dataset.alt
    };
  }
  /**
   *
   * @param {Suggestion} suggestion
   * @returns {HTMLOptionElement} - an option
   */
  _mapToOption(e) {
    const t = document.createElement("option");
    return t.label = e.label, t.value = e.value, e.hidden && t.setAttribute("hidden", "hidden"), e.disabled && t.setAttribute("disabled", "disabled"), e.selected && t.setAttribute("selected", "selected"), e.image && (t.dataset.image = e.image), e.alt && (t.dataset.alt = e.alt), t;
  }
  /**
   * @callback FillSuggestions
   * @param {string} search - searched term
   * @param {Array<HTMLOptionElement>} options - original select options
   * @returns {Promise<Array<Suggestion>>} suggestions
   */
  /**
   *
   * @type {FillSuggestions}
   */
  _defaultSearch(e, t) {
    const i = t.filter((s) => (s.label || s.value).toLocaleLowerCase().indexOf(e) !== -1).map(this._mapToSuggestion);
    return Promise.resolve(i);
  }
  /**
   *
   * @returns {Promise<Array<Suggestion>>}
   */
  async _fillSuggestions() {
    const e = this.search.toLowerCase(), t = await this._options.fillSuggestions(e, this.updatedOriginalOptions);
    this.currentOptions = t.map(this._mapToOption), this.el.replaceChildren(...this.currentOptions);
    const i = t.filter((s) => !s.hidden && !s.disabled).map((s, l) => {
      const a = document.createElement("div");
      if (a.setAttribute("role", "option"), a.setAttribute("tabindex", "0"), a.setAttribute("data-index", l.toString()), a.classList.add("select-a11y-suggestion"), a.innerText = s.label || s.value, s.selected && a.setAttribute("aria-selected", "true"), s.image) {
        const n = document.createElement("img");
        n.setAttribute("src", s.image), n.setAttribute("alt", s.alt ? s.alt : ""), n.classList.add("select-a11y-suggestion__image"), a.prepend(n);
      }
      return a;
    });
    if (this.suggestions = i, this.list)
      if (!i.length)
        this.list.innerHTML = `<p class="select-a11y__no-suggestion">${this._options.text.noResult}</p>`;
      else {
        const s = document.createElement("div");
        s.setAttribute("role", "listbox"), this.multiple && s.setAttribute("aria-multiselectable", "true"), i.forEach((l) => {
          s.appendChild(l);
        }), this.list.innerHTML = "", this.list.appendChild(s);
      }
    return this._setLiveZone(), t;
  }
  _handleOpener(e) {
    this._toggleOverlay();
  }
  _handleFocus() {
    this.open && (clearTimeout(this._focusTimeout), this._focusTimeout = setTimeout(() => {
      if (!this.overlay.contains(document.activeElement) && this.button !== document.activeElement)
        this._toggleOverlay(!1, document.activeElement === document.body);
      else if (document.activeElement === this.input)
        this.focusIndex = null;
      else {
        const e = this.suggestions.indexOf(
          /** @type HTMLElement */
          document.activeElement
        );
        e !== -1 && (this.focusIndex = e);
      }
    }, 10));
  }
  _handleClear() {
    this.el.value = "", this._handleReset();
  }
  _handleReset() {
    clearTimeout(this._resetTimeout), this._resetTimeout = setTimeout(async () => {
      this.search = "", this.updatedOriginalOptions = d(this.originalOptions), this.currentOptions = d(this.originalOptions), await this._fillSuggestions(), this.el.dispatchEvent(new Event("change")), this._setButtonText(), this.multiple && this._options.showSelected && this._updateSelectedList();
    }, 10);
  }
  _handleSuggestionClick(e) {
    const t = o.call(e.target, '[role="option"]');
    if (!t)
      return;
    const i = parseInt(t.getAttribute("data-index"), 10), s = !(this.multiple && e.metaKey);
    this._toggleSelection(i, s);
  }
  _handleInput() {
    var e, t;
    this.search !== ((e = this.input) == null ? void 0 : e.value) && (this.search = ((t = this.input) == null ? void 0 : t.value) ?? "", this._fillSuggestions());
  }
  _handleKeyboard(e) {
    const t = o.call(e.target, '[role="option"]'), i = o.call(e.target, "input");
    if (e.keyCode === 27) {
      this._toggleOverlay();
      return;
    }
    if (i && e.keyCode === 13) {
      e.preventDefault();
      return;
    }
    if (e.keyCode === 40) {
      e.preventDefault(), this._moveIndex(1);
      return;
    }
    if (t) {
      if (e.keyCode === 39) {
        e.preventDefault(), this._moveIndex(1);
        return;
      }
      if (e.keyCode === 37 || e.keyCode === 38) {
        e.preventDefault(), this._moveIndex(-1);
        return;
      }
      (!this.multiple && e.keyCode === 13 || e.keyCode === 32) && (e.preventDefault(), this._toggleSelection(parseInt(t.getAttribute("data-index"), 10), !this.multiple)), this.multiple && e.keyCode === 13 && this._toggleOverlay();
    }
  }
  _moveIndex(e) {
    if (this.focusIndex === null)
      this.focusIndex = 0;
    else {
      const t = this.focusIndex + e, i = this.suggestions.length - 1;
      t > i ? this.focusIndex = 0 : t < 0 ? this.focusIndex = i : this.focusIndex = t;
    }
    this.suggestions[this.focusIndex].focus();
  }
  _positionCursor() {
    setTimeout(() => {
      if (this.input) {
        const e = this.input.value.length ?? 0;
        this.input.setSelectionRange(e, e);
      }
    });
  }
  _removeOption(e) {
    var a, n;
    const t = o.call(e.target, "button");
    if (!t)
      return;
    const i = (a = this.selectedList) == null ? void 0 : a.querySelectorAll("button"), s = Array.prototype.indexOf.call(i, t) - 1, l = parseInt(t.getAttribute("data-index"), 10);
    if (this._toggleSelection(l), (n = this.selectedList) != null && n.parentElement) {
      const h = this.selectedList.querySelectorAll("button");
      h[s] ? h[s].focus() : h[0].focus();
    } else
      this.button.focus();
  }
  _setButtonText() {
    if (!this.multiple) {
      const e = this.el.item(this.el.selectedIndex);
      if (e) {
        e.value ? this.button.classList.remove("select-a11y-button--no-selected-option") : this.button.classList.add("select-a11y-button--no-selected-option");
        const t = this.button.firstElementChild;
        t instanceof HTMLElement && (t.innerText = e.label || e.value);
      }
    }
  }
  _setLiveZone() {
    const e = this.suggestions.length;
    let t = "";
    this.open && (e ? t = this._options.text.results.replace("{x}", e) : t = this._options.text.noResult), this.liveZone.innerText = t;
  }
  _toggleOverlay(e, t) {
    var i;
    this.open = e !== void 0 ? e : !this.open, this.button.setAttribute("aria-expanded", this.open ? "true" : "false"), this.open ? (this._fillSuggestions(), this.button.insertAdjacentElement("afterend", this.overlay), (i = this.input) == null || i.focus()) : this.wrap.contains(this.overlay) && (this.wrap.removeChild(this.overlay), this.focusIndex = null, this.input && (this.input.value = ""), this.search = "", this._setLiveZone(), (e === void 0 || t) && setTimeout(() => {
      this.button.focus();
    }));
  }
  _toggleSelection(e, t = !0, i = !0) {
    const s = this.el.item(e);
    this.multiple ? s != null && s.hasAttribute("selected") ? s.removeAttribute("selected") : s == null || s.setAttribute("selected", "selected") : (s == null || s.setAttribute("selected", "selected"), this.el.selectedIndex = e), this.updatedOriginalOptions = this.updatedOriginalOptions.map((l) => (l.value === (s == null ? void 0 : s.value) && (s.hasAttribute("selected") ? l.setAttribute("selected", "selected") : l.removeAttribute("selected")), !this.multiple && l.value !== (s == null ? void 0 : s.value) && l.removeAttribute("selected"), l)), this.suggestions = this.suggestions.map((l) => {
      const a = parseInt(l.getAttribute("data-index") ?? "", 10), n = this.el.item(a);
      return n && n.selected ? l.setAttribute("aria-selected", "true") : l.removeAttribute("aria-selected"), l;
    }), i && this.el.dispatchEvent(new Event("change")), this._setButtonText(), this.multiple && this._options.showSelected && this._updateSelectedList(), t && this.open && this._toggleOverlay();
  }
  _updateSelectedList() {
    var t;
    const e = this.currentOptions.map((i, s) => {
      if (!i.selected)
        return;
      const l = i.label || i.value;
      return `
        <li class="select-a11y__selected-item">
          <span>${l}</span>
          <button class="select-a11y-delete" title="${this._options.text.deleteItem.replace("{t}", l)}" type="button" data-index="${s}">
            <span class="sr-only">${this._options.text.delete}</span>
            <span class="select-a11y-delete__icon" aria-hidden="true"></span>
          </button>
        </li>`;
    }).filter(Boolean);
    this.selectedList && (this.selectedList.innerHTML = e.join(""), e.length ? (t = this.selectedList) != null && t.parentElement || this.wrap.appendChild(this.selectedList) : this.selectedList.parentElement && this.wrap.removeChild(this.selectedList));
  }
  _wrap() {
    var i;
    const e = document.createElement("div");
    e.classList.add("select-a11y"), (i = this.el.parentElement) == null || i.appendChild(e);
    const t = document.createElement("div");
    return t.classList.add("select-a11y__hidden"), t.setAttribute("aria-hidden", "true"), (this.multiple || this._options.useLabelAsButton) && t.appendChild(this.label), t.appendChild(this.el), e.appendChild(t), e.appendChild(this.liveZone), e.appendChild(this.button), this._options.clearable && e.appendChild(this.clearButton), e;
  }
}
export {
  m as Select,
  m as default
};
//# sourceMappingURL=select-a11y.js.map
