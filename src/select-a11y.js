const text = {
  help: 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions',
  placeholder: 'Rechercher dans la liste',
  noResult: 'aucun résultat',
  results: '{x} suggestion(s) disponibles',
  deleteItem: 'supprimer {t}',
  delete: 'supprimer'
};

const matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
const closest = Element.prototype.closest;

if (!closest) {
  closest = function(s) {
    var el = this;

    do {
      if (matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

class Select{
  constructor( el, options ){
    this.el = el;
    this.label = document.querySelector(`label[for=${el.id}]`);
    this.id = el.id;
    this.open = false;
    this.multiple = this.el.multiple;
    this.search = '';
    this.suggestions = [];
    this.focusIndex = null;

    const passedOptions = Object.assign({}, options);
    const textOptions = Object.assign(text, passedOptions.text);
    delete passedOptions.text;

    this._options = Object.assign({
      text: textOptions,
      showSelected: true
    }, passedOptions );

    this._handleFocus = this._handleFocus.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleKeyboard = this._handleKeyboard.bind(this);
    this._handleOpener = this._handleOpener.bind(this);
    this._handleReset = this._handleReset.bind(this);
    this._handleSuggestionClick = this._handleSuggestionClick.bind(this);
    this._positionCursor = this._positionCursor.bind(this);
    this._removeOption = this._removeOption.bind(this);

    this._disable();

    this.button = this._createButton();
    this.liveZone = this._createLiveZone();
    this.overlay = this._createOverlay();
    this.wrap = this._wrap();

    if(this.multiple && this._options.showSelected){
      this.selectedList = this._createSelectedList();
      this._updateSelectedList();

      this.selectedList.addEventListener('click', this._removeOption);
    }

    this.button.addEventListener('click', this._handleOpener);
    this.input.addEventListener('input', this._handleInput);
    this.input.addEventListener('focus', this._positionCursor, true);
    this.list.addEventListener('click', this._handleSuggestionClick);
    this.wrap.addEventListener('keydown', this._handleKeyboard);
    document.addEventListener('blur', this._handleFocus, true);

    this.el.form.addEventListener('reset', this._handleReset);
  }

  _createButton(){
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', this.open);
    button.className = 'btn btn-select-a11y';

    const text = document.createElement('span');

    if(this.multiple){
      text.innerText = this.label.innerText;
    }
    else {
      const selectedOption = this.el.item(this.el.selectedIndex);
      text.innerText = selectedOption.label || selectedOption.value;

      if(!this.label.id){
        this.label.id = `${this.el.id}-label`;
      }
      button.setAttribute('aria-labelledby', this.label.id);
    }

    button.appendChild(text);

    button.insertAdjacentHTML('beforeend', '<span class="icon-select" aria-hidden="true"></span>');

    return button;
  }

  _createLiveZone(){
    const live = document.createElement('p');
    live.setAttribute('aria-live', 'polite');
    live.classList.add('sr-only');

    return live;
  }

  _createOverlay(){
    const container = document.createElement('div');
    container.classList.add('a11y-container');

    const suggestions = document.createElement('div');
    suggestions.classList.add('a11y-suggestions');
    suggestions.id = `a11y-${this.id}-suggestions`;

    container.innerHTML = `
      <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
      <label for="a11y-${this.id}-js" class="sr-only">${this._options.text.placeholder}</label>
      <input type="text" id="a11y-${this.id}-js" class="${this.el.className}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${this._options.text.placeholder}" aria-describedby="a11y-usage-${this.id}-js">
    `;

    container.appendChild(suggestions);

    this.list = suggestions;
    this.input = container.querySelector('input');

    return container;
  }

  _createSelectedList() {
    const list = document.createElement('ul');
    list.className = 'list-inline list-selected';

    return list;
  }

  _disable() {
    this.el.setAttribute('tabindex', -1);
  }

  _fillSuggestions(){
    const search = this.search.toLowerCase();

    // loop over the
    this.suggestions = Array.prototype.map.call(this.el.options, function(option, index){
      const text = option.label || option.value;
      const formatedText = text.toLowerCase();

      // test if search text match the current option
      if(formatedText.indexOf(search) === -1){
        return;
      }

      // create the option
      const suggestion = document.createElement('div');
      suggestion.setAttribute('role', 'option');
      suggestion.setAttribute('tabindex', 0);
      suggestion.setAttribute('data-index', index)
      suggestion.classList.add('a11y-suggestion');

      // check if the option is selected
      const selected = Array.prototype.indexOf.call(this.el.selectedOptions, option) !== -1;

      if(selected){
        suggestion.setAttribute('aria-selected', 'true');
      }

      suggestion.innerText = option.label || option.value;

      return suggestion;
    }.bind(this)).filter(Boolean);

    if(!this.suggestions.length){
      this.list.innerHTML = `<p class="a11y-no-suggestion">${this._options.text.noResult}</p>`;
    }
    else {
      const listBox = document.createElement('div');
      listBox.setAttribute('role', 'listbox');

      if(this.multiple){
        listBox.setAttribute('aria-multiselectable', 'true');
      }


      this.suggestions.forEach(function(suggestion){
        listBox.appendChild(suggestion);
      }.bind(this));

      this.list.innerHTML = '';
      this.list.appendChild(listBox);
    }

    this._setLiveZone();
  }

  _handleOpener(event){
    this._toggleOverlay();
  }

  _handleFocus(){
    if(!this.open){
      return;
    }

    clearTimeout(this._focusTimeout);

    this._focusTimeout = setTimeout(function(){
      if(!this.overlay.contains(document.activeElement) && this.button !== document.activeElement){
        this._toggleOverlay( false, document.activeElement === document.body);
      }
      else if(document.activeElement === this.input){
        // reset the focus index
        this.focusIndex =  null;
      }
      else {
        const optionIndex = this.suggestions.indexOf(document.activeElement);

        if(optionIndex !== -1){
          this.focusIndex = optionIndex;
        }
      }
    }.bind(this), 10);
  }

  _handleReset(){
    clearTimeout(this._resetTimeout);

    this._resetTimeout = setTimeout(function(){
      this._fillSuggestions();
      if(this.multiple && this._options.showSelected){
        this._updateSelectedList();
      }
    }.bind(this), 10);
  }

  _handleSuggestionClick(event){
    const option = closest.call(event.target, '[role="option"]');

    if(!option){
      return;
    }

    const optionIndex = parseInt(option.getAttribute('data-index'), 10);
    const shouldClose = this.multiple && event.metaKey ? false : true;

    this._toggleSelection(optionIndex, shouldClose);
  }

  _handleInput(){
    this.search = this.input.value;
    this._fillSuggestions();
  }

  _handleKeyboard(event){
    const option = closest.call(event.target, '[role="option"]');
    const input = closest.call(event.target, 'input');

    if(event.keyCode === 27){
      this._toggleOverlay();
      return;
    }

    if(input && event.keyCode === 13){
      event.preventDefault();
      return;
    }

    if(event.keyCode === 40){
      event.preventDefault();
      this._moveIndex(1);
      return
    }

    if(!option){
      return;
    }

    if(event.keyCode === 39){
      event.preventDefault();
      this._moveIndex(1);
      return
    }

    if(event.keyCode === 37 || event.keyCode === 38){
      event.preventDefault();
      this._moveIndex(-1);
      return;
    }

    if(event.keyCode === 13 || event.keyCode === 32){
      event.preventDefault();
      this._toggleSelection(parseInt(option.getAttribute('data-index'), 10), this.multiple ? false : true);
    }

    if(this.multiple && event.keyCode === 13){
      this._toggleOverlay();
    }
  }

  _moveIndex(step){
    if(this.focusIndex === null){
      this.focusIndex = 0;
    }
    else {
      const nextIndex = this.focusIndex + step;
      const selectionItems = this.suggestions.length - 1;

      if(nextIndex > selectionItems){
        this.focusIndex = 0;
      }
      else if(nextIndex < 0){
        this.focusIndex = selectionItems;
      }
      else {
        this.focusIndex = nextIndex;
      }
    }

    this.suggestions[this.focusIndex].focus();
  }

  _positionCursor(){
    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
  }

  _removeOption(event){
    const button = closest.call(event.target, 'button');

    if(!button){
      return;
    }

    const currentButtons = this.selectedList.querySelectorAll('button');
    const buttonPreviousIndex = Array.prototype.indexOf.call(currentButtons, button) - 1;
    const optionIndex = parseInt( button.getAttribute('data-index'), 10);

    // disable the option
    this._toggleSelection(optionIndex);

    // manage the focus if there's still the selected list
    if(this.selectedList.parentElement){
      const buttons = this.selectedList.querySelectorAll('button');

      // loock for the bouton before the one clicked
      if(buttons[buttonPreviousIndex]){
        buttons[buttonPreviousIndex].focus();
      }
      // fallback to the first button in the list if there's none
      else {
        buttons[0].focus();
      }
    }
    else {
      this.button.focus();
    }
  }

  _setButtonText(text){
    this.button.firstElementChild.innerText = text;
  }

  _setLiveZone(){
    const suggestions = this.suggestions.length;
    let text = '';

    if(this.open){
      if(!suggestions){
        text = this._options.text.noResult;
      }
      else {
        text = this._options.text.results.replace('{x}', suggestions);
      }
    }

    this.liveZone.innerText = text;
  }

  _toggleOverlay(state, focusBack){
    this.open = state !== undefined ? state : !this.open;
    this.button.setAttribute('aria-expanded', this.open);

    if(this.open){
      this._fillSuggestions();
      this.button.insertAdjacentElement('afterend', this.overlay);
      this.input.focus();
    }
    else if(this.wrap.contains(this.overlay)){
      this.wrap.removeChild(this.overlay);

      // reset the focus index
      this.focusIndex =  null;

      // reset search values
      this.input.value = '';
      this.search = '';


      // reset aria-live
      this._setLiveZone();
      if(state === undefined || focusBack){
        // fix bug that will trigger a click on the button when focusing directly
        setTimeout(function(){
          this.button.focus();
        }.bind(this))
      }
    }
  }

  _toggleSelection(optionIndex, close = true){
    const option = this.el.item(optionIndex);

    if(this.multiple){
      this.el.item(optionIndex).selected = !this.el.item(optionIndex).selected;
    }
    else {
      this.el.selectedIndex = optionIndex;
    }

    this.suggestions.forEach(function(suggestion){
      const index = parseInt(suggestion.getAttribute('data-index'), 10);

      if(this.el.item(index).selected){
        suggestion.setAttribute('aria-selected', 'true');
      }
      else{
        suggestion.removeAttribute('aria-selected');
      }
    }.bind(this));

    if(!this.multiple){
      this._setButtonText(option.label || option.value);
    }
    else if(this._options.showSelected){
      this._updateSelectedList();
    }

    if(close && this.open){
      this._toggleOverlay();
    }
  }

  _updateSelectedList(){
    const items = Array.prototype.map.call(this.el.options, function(option, index){
      if(!option.selected){
        return;
      }

      const text = option.label || option.value;

      return `
        <li class="tag-item">
          <span>${text}</span>
          <button class="tag-item-supp" title="${this._options.text.deleteItem.replace('{t}', text)}" type="button" data-index="${index}">
            <span class="sr-only">${this._options.text.delete}</span>
            <span class="icon-delete" aria-hidden="true"></span>
          </button>
        </li>`;
    }.bind(this)).filter(Boolean);

    this.selectedList.innerHTML = items.join('');

    if(items.length){
      if(!this.selectedList.parentElement){
        this.wrap.appendChild(this.selectedList);
      }
    }
    else {
      this.wrap.removeChild(this.selectedList);
    }
  }

  _wrap(){
    const wrapper = document.createElement('div');
    wrapper.classList.add('select-a11y');
    this.el.parentElement.appendChild(wrapper);

    const tagHidden = document.createElement('div');
    tagHidden.classList.add('tag-hidden');
    tagHidden.setAttribute('aria-hidden', true);

    if(this.multiple){
      tagHidden.appendChild(this.label);
    }
    tagHidden.appendChild(this.el);

    wrapper.appendChild(tagHidden);
    wrapper.appendChild(this.liveZone);
    wrapper.appendChild(this.button);

    return wrapper;
  }
}

export default Select;
