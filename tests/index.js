/* eslint-env node */
'use strict';

const nodePath = require('path');
const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${nodePath.resolve(__dirname, '../public/index.html')}`;

const createBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto( path );

  return { browser, page };
};

test( 'Creation du select-a11y simple', async t => {
  const { browser, page } = await createBrowser();

  const {label, select} = await page.evaluate(() => {
    const wrapper = document.querySelector('.form-group');
    const selectA11y = wrapper.querySelector('.select-a11y');
    const label = wrapper.firstElementChild;

    return {
      label: {
        stayed: label && label.getAttribute('for') === 'select-option',
        id: label && label.id
      },
      select: selectA11y !== null
    }
  });

  t.true( label.stayed, 'Le label n’est pas déplacé' );
  t.true( select, 'Le conteneur de select-a11y est créé' );

  const { tagHidden, live, button } = await page.evaluate(() => {
    const selectA11y = document.querySelector('.form-group > .select-a11y');
    const tagHidden = selectA11y.querySelector('.tag-hidden');
    const live = selectA11y.querySelector('[aria-live]');
    const button = selectA11y.querySelector('button[aria-expanded]');
    const label = selectA11y.querySelector('label');


    return {
      tagHidden: {
        exists: tagHidden !== null,
        isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
        select: tagHidden && tagHidden.firstElementChild.tagName
      },
      live: {
        exists: live !== null,
        isPolite: live && live.getAttribute('aria-live') === 'polite'
      },
      button: {
        exists: button !== null,
        isClosed: button && button.getAttribute('aria-expanded') === 'false',
        labelledby: button && button.getAttribute('aria-labelledby')
      }
    }
  });

  t.true( tagHidden.exists, 'Le conteneur du select original est créé');
  t.same( tagHidden.select, 'SELECT', 'Le conteneur du select original contient bien le select original');
  t.true( tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran');

  t.true( live.exists, 'L‘élément de restitution vocal est créé');
  t.true( live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »');

  t.true( button.exists, 'Le bouton permettant d’ouvrir le select est créé');
  t.true( button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut');
  t.true( button.labelledby.includes( label.id ), 'Le bouton est lié au label via l’attribut « aria-labelledby »');

  await browser.close();

  t.end();
});

test( 'Creation du select-a11y multiple', async t => {
  const { browser, page } = await createBrowser();

  const {select} = await page.evaluate(() => {
    const wrapper = document.querySelector('.form-group');
    const selectA11y = wrapper.querySelector('.select-a11y');

    return {
      select: selectA11y !== null
    }
  });

  t.true( select, 'Le conteneur de select-a11y est créé' );

  const { tagHidden, live, button} = await page.evaluate(() => {
    const selectA11y = document.querySelectorAll('.form-group > .select-a11y')[1];
    const tagHidden = selectA11y.querySelector('.tag-hidden');
    const live = selectA11y.querySelector('[aria-live]');
    const button = selectA11y.querySelector('button[aria-expanded]');


    return {
      tagHidden: {
        exists: tagHidden !== null,
        isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
        label: tagHidden && tagHidden.firstElementChild.tagName,
        hasSelect: tagHidden && tagHidden.querySelector('select') !== null
      },
      live: {
        exists: live !== null,
        isPolite: live && live.getAttribute('aria-live') === 'polite'
      },
      button: {
        exists: button !== null,
        isClosed: button && button.getAttribute('aria-expanded') === 'false'
      }
    }
  });

  t.true( tagHidden.exists, 'Le conteneur du select original est créé');
  t.true( tagHidden.hasSelect, 'Le conteneur du select original contient bien le select original');
  t.same( tagHidden.label, 'LABEL', 'Le conteneur du select original contient bien le label du select original');
  t.true( tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran');

  t.true( live.exists, 'L‘élément de restitution vocal est créé');
  t.true( live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »');

  t.true( button.exists, 'Le bouton permettant d’ouvrir le select est créé');
  t.true( button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut');

  await browser.close();

  t.end();
});

test( 'État par défaut', async t => {
  const { browser, page } = await createBrowser();

  const selects = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));

    return selects.map(select => {
      const wrapper = select.closest('.select-a11y');
      const label = document.querySelector(`label[for=${select.id}]`);

      const button = wrapper.querySelector('button[aria-expanded]');

      if(select.multiple){
        const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
        const listItems = Array.from(wrapper.querySelectorAll('.tag-item')).map(item => item.firstElementChild.textContent.trim());

        return {
          multiple: true,
          label: label.textContent.trim(),
          buttonLabel: button.textContent.trim(),
          values: selectedValues.join(':'),
          listItems: listItems.join(':'),
        }
      }
      else {
        return {
          multiple: false,
          buttonLabel: button.textContent.trim(),
          value: select.value,
        }
      }
    });
  });

  selects.forEach(select => {
    if(select.multiple){
      t.same(select.label, select.buttonLabel, 'Le select multiple affiche le label dans le bouton d’ouverture');
      t.same(select.listItems, select.values, 'Le select multiple affiche une liste des éléments sélectionnés par défaut');
    }
    else {
      t.same(select.buttonLabel, select.value, 'Le select affiche la valeur de l’élément sélectionné par défaut dans le bouton d’ourerture');
    }
  });

  await browser.close();

  t.end();
});

test( 'Création de la liste lors de l’ouverture du select simple', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.form-group button');

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const select = wrapper.querySelector('select');
    const container = document.querySelector('.a11y-container');
    const help = container.firstElementChild;
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    const options = container.querySelectorAll('[role="option"]');

    const listBox = container.querySelector('[role="listbox"]');

    return {
      hasContainer: wrapper.contains(container),
      help: {
        isParagraph: help.tagName === 'P',
        id: help.id
      },
      label: {
        for: label.getAttribute('for')
      },
      input: {
        id: input.id,
        describedby: input.getAttribute('aria-describedby')
      },
      list: {
        length: options.length
      },
      options: {
        length: select.options.length
      },
      listBox: {
        multiple: listBox.hasAttribute('aria-multiselectable')
      },
    }
  });

  t.true(data.hasContainer, 'La liste est créée lors de l’activation du bouton');
  t.true(data.help.isParagraph, 'Le texte explicatif est présent');
  t.same(data.help.id, data.input.describedby, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »');
  t.same(data.label.for, data.input.id, 'Le label est lié au champ de recherche via l’attribut « for »');
  t.same(data.list.length, data.options.length, 'La liste crée contient le même nombre d’options que le select');
  t.false(data.listBox.multiple, 'La liste pour le select ne contient pas d’attribut « aria-multiselectable »');

  await browser.close();

  t.end();
});

test( 'Création de la liste lors de l’ouverture du select multiple', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.multiple button');

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.multiple .select-a11y');
    const select = wrapper.querySelector('select');
    const container = document.querySelector('.multiple .a11y-container');
    const help = container.firstElementChild;
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    const options = container.querySelectorAll('[role="option"]');

    const listBox = container.querySelector('[role="listbox"]');

    return {
      hasContainer: wrapper.contains(container),
      help: {
        isParagraph: help.tagName === 'P',
        id: help.id
      },
      label: {
        for: label.getAttribute('for')
      },
      input: {
        id: input.id,
        describedby: input.getAttribute('aria-describedby')
      },
      list: {
        length: options.length
      },
      options: {
        length: select.options.length
      },
      listBox: {
        multiple: listBox.getAttribute('aria-multiselectable')
      },
    }
  });

  t.true(data.hasContainer, 'La liste est créée lors de l’activation du bouton');
  t.true(data.help.isParagraph, 'Le texte explicatif est présent');
  t.same(data.help.id, data.input.describedby, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »');
  t.same(data.label.for, data.input.id, 'Le label est lié au champ de recherche via l’attribut « for »');
  t.same(data.list.length, data.options.length, 'La liste crée contient le même nombre d’options que le select');
  t.same(data.listBox.multiple, 'true', 'La liste pour le select contient l’attribut « aria-multiselectable »');

  await browser.close();

  t.end();
});

test( 'Gestion du champ de recherche', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.multiple button');

  await page.type('#a11y-select-element-js', 'ee');

  await page.keyboard.press('ArrowDown');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const data = await page.evaluate(() => {
    const input = document.getElementById('a11y-select-element-js');
    const activeElement = document.activeElement;
    const options = document.querySelectorAll('.multiple [role="option"]')
    if(input instanceof HTMLInputElement) {
      return {
        focused: input === activeElement,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
        length: input.value.length,
        displayedOptions: options.length
      }
    }
    return {
      focused: input === activeElement,
      displayedOptions: options.length
    }
  });

  t.true(data.focused, 'Le focus est dans le champ');
  t.same(data.selectionStart, data.selectionEnd, 'Le focus ne sélectionne pas tout le texte du champ');
  t.same(data.selectionStart, data.length, 'Le curseur est positionné en fin de texte');
  t.same(data.displayedOptions, 2, 'La liste des options est filtrée lorsque qu’un texte est saisi dans le champ');

  await page.type('#a11y-select-element-js', 'eee');

  const noResult = await page.evaluate(() => {
    return document.querySelectorAll('.multiple .a11y-no-suggestion') !== undefined
  });

  t.true(noResult, 'La liste affiche un message d’erreur lorsqu’il n’y a pas d’option s’approchant du texte saisi dans le champ');

  await browser.close();

  t.end();
});

test( 'Gestion de la selection au clavier d’un select', async t => {
  const { browser, page } = await createBrowser();

  await page.focus('.form-group button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await page.keyboard.press('Space');

  await page.waitForTimeout(10);

  const spacePressed = await page.evaluate(() => {
    const button = document.querySelector('.form-group button');
    const select = document.querySelector('.form-group select');
    const activeElement = document.activeElement;

    if(select instanceof HTMLSelectElement) {
      return {
        closed: button.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        selectedLabel: [button.firstElementChild.textContent.trim()],
        selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
      }
    }
    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      selectedLabel: [button.firstElementChild.textContent.trim()],
    }
  });

  t.true(spacePressed.closed, 'L’appui sur la barre d’espace sur une option ferme la liste des options');
  t.true(spacePressed.focus, 'L’appui sur la barre d’espace sur une option rend le focus au bouton d’ouverture');
  t.same(spacePressed.selectedOptions.length, 1, 'Le select comporte une options sélectionnée' );
  t.same(spacePressed.selectedLabel, spacePressed.selectedOptions, 'L’appui sur la barre d’espace sur une option sélectionne l’option');

  await page.reload();

  await page.focus('.form-group button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await page.keyboard.press('Enter');

  await page.waitForTimeout(10);

  const enterPressed = await page.evaluate(() => {
    const button = document.querySelector('.form-group button');
    const select = document.querySelector('.form-group select');
    const activeElement = document.activeElement;

    if(select instanceof HTMLSelectElement) {
      return {
        closed: button.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        active: activeElement.tagName,
        selectedLabel: [button.firstElementChild.textContent.trim()],
        selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
      }
    }
    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      active: activeElement.tagName,
      selectedLabel: [button.firstElementChild.textContent.trim()],
    }
  });

  t.true(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options');
  t.true(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture');
  t.same(enterPressed.selectedOptions.length, 1, 'Le select comporte une options sélectionnée' );
  t.same(enterPressed.selectedLabel, enterPressed.selectedOptions, 'L’appui sur la touche entrée sur une option sélectionne l’option');

  await browser.close();

  t.end();
});

test( 'Gestion de la selection au clavier d’un select multiple', async t => {
  const { browser, page } = await createBrowser();

  await page.focus('.form-group.multiple button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');

  await page.keyboard.press('Space');

  await page.waitForTimeout(10);

  const spacePressed = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const select = document.querySelector('.multiple select');
    const activeElement = document.activeElement;

    if(select instanceof HTMLSelectElement) {
      return {
        open: button.getAttribute('aria-expanded') === 'true',
        selected: activeElement.getAttribute('aria-selected') === 'true',
        selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
      }
    }
    return {
      open: button.getAttribute('aria-expanded') === 'true',
      selected: activeElement.getAttribute('aria-selected') === 'true',
    }
  });

  t.true(spacePressed.open, 'L’appui sur la barre d’espace sur une option ne ferme pas la liste des options d’un select multiple');
  t.true(spacePressed.selected, 'L’appui sur la barre d’espace sur une option sélectionne l’option');
  t.same(spacePressed.selectedOptions.length, 2, 'Le select comporte 2 options sélectionnées' );

  await page.keyboard.press('Tab');

  await page.keyboard.press('Enter');

  await page.waitForTimeout(10);

  const enterPressed = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const select = document.querySelector('.multiple select');
    const activeElement = document.activeElement;
    const list = Array.from(document.querySelectorAll('.multiple .list-selected li'));

    if(select instanceof HTMLSelectElement) {
      return {
        closed: button.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
        selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
      }
    }
    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
    }
  });

  t.true(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options');
  t.true(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture');
  t.same(enterPressed.selectedOptions.length, 2, 'Le select comporte 2 options sélectionnées' );
  t.same(enterPressed.selectedItems, enterPressed.selectedOptions, 'L’appui sur la touche entrée sur une option sélectionne l’option');

  await browser.close();

  t.end();
});

test( 'Suppression des options via la liste des options sélectionnées', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.multiple button');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');

  await page.focus('.list-selected .tag-item:nth-child(3) button');
  await page.keyboard.press('Enter');

  const secondButtonFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.list-selected .tag-item:nth-child(2) button');
  });

  t.true(secondButtonFocused, 'Le focus est placé sur le bouton précédant dans l’ordre du document lors de la suppression');

  await page.focus('.list-selected .tag-item:nth-child(1) button');
  await page.keyboard.press('Enter');

  const firstButtonFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.list-selected .tag-item:nth-child(1) button');
  });

  t.true(firstButtonFocused, 'Le focus est placé sur le premier bouton dans l’ordre du document lors de la suppression du premier bouton');

  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  const openerFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.multiple button');
  });

  t.true(openerFocused, 'Le focus est placé sur le bouton d’ouverture du select lorsque tous les boutons de suppression ont disparu');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste au blur', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.multiple button');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const buttonFocus = await page.evaluate(() => {
    const button = document.activeElement;

    return {
      isButton: document.activeElement === document.querySelector('.multiple button'),
      expanded: button.getAttribute('aria-expanded')
    }
  });

  t.same(buttonFocus.isButton && buttonFocus.expanded, 'true', 'La liste reste ouverte lorsque le bouton d’ouverture à la focus');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  await page.waitForTimeout(10);

  const buttonBlurTopExpanded = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');

    return button.getAttribute('aria-expanded');
  });

  t.same(buttonBlurTopExpanded, 'false', 'La liste est fermée lorsque le focus est en dehors du select');

  await page.click('.multiple button');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await page.waitForTimeout(10);

  const select = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const selected = document.querySelector('.multiple .tag-item button');

    return {
      expanded: button.getAttribute('aria-expanded'),
      selectionFocused: selected === document.activeElement
    }
  });

  t.same(select.selectionFocused && select.expanded, 'false', 'La liste est fermée lorsque le focus est sur les boutons de la liste de sélection');

  await page.click('.multiple button');

  await page.waitForTimeout(10);

  await page.click('body')

  await page.waitForTimeout(20);

  const focused = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');

    return button === document.activeElement
  });

  t.true(focused, 'La liste est fermée lorsqu’on clique en dehors');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste du select simple au clic', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.form-group button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await page.waitForTimeout(10);

  const clickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.form-group button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(clickStatus.expanded, 'false', 'La liste est refermée après un clic sur une option');
  t.true(clickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste');

  await page.click('.form-group button');

  await page.keyboard.down('Meta');
  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');
  await page.keyboard.up('Meta');

  await page.waitForTimeout(10);

  const metaClickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.form-group button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(metaClickStatus.expanded, 'false', 'La liste est refermée après un meta + clic sur une option');
  t.true(metaClickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste du select multiple au clic', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.multiple button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await page.waitForTimeout(10);

  const clickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.multiple button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(clickStatus.expanded, 'false', 'La liste est refermée après un clic sur une option');
  t.true(clickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste');

  await page.click('.multiple button');

  await page.keyboard.down('Meta');
  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');
  await page.keyboard.up('Meta');

  await page.waitForTimeout(10);

  const metaClickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.form-group button');
    const option = document.querySelector('.a11y-suggestions [role="option"]:nth-child(2')

    return {
      expanded: opener.getAttribute('aria-expanded'),
      optionFocused: option === activeElement
    }
  });

  t.same(metaClickStatus.expanded, 'false', 'La liste n’est pas refermée après un meta + clic sur une option');
  t.true(metaClickStatus.optionFocused, 'Le focus reste sur l’option cliquée');

  await browser.close();

  t.end();
});

test( 'Navigation au clavier', async t => {
  const { browser, page } = await createBrowser();

  await page.focus('.form-group button');

  await page.keyboard.press('Enter');

  await page.keyboard.press('ArrowDown');

  const firstElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(firstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste');

  await page.keyboard.press('ArrowUp');

  const lastElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(4)');
  });

  t.true(lastElementSelected, 'La touche « flèche haut » déplace le focus sur le dernier élément de la liste lorsque le premier élément à le focus');

  await page.keyboard.press('ArrowDown');

  const backToFirstElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(backToFirstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste lorsque le dernier élément à le focus');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');

  const nextElement = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(3)');
  });

  t.true(nextElement, 'La touche « flèche bas » déplace le focus sur l’élement suivant');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');

  const previous = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(previous, 'La touche « flèche haut » déplace le focus sur l’élement précédent');

  await browser.close();

  t.end();
});

test( 'Reset du formulaire', async t => {
  const { browser, page } = await createBrowser();

  await page.click('.form-group button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await page.waitForTimeout(10);

  await page.click('.multiple button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await page.waitForTimeout(10);

  await page.click('[type="reset"]');

  await page.waitForTimeout(10);

  const [singleState, multipleState] = await page.evaluate(() => {
    const singleSelect = document.querySelector('select[data-select-a11y]:not([multiple])');
    const multipleSelect = document.querySelector('select[data-select-a11y][multiple]');
    const list = Array.from(document.querySelectorAll('.multiple .list-selected li'));

    if(singleSelect instanceof HTMLSelectElement && multipleSelect instanceof HTMLSelectElement) {
      return [
        {
          selectedValue: singleSelect.value,
          label: document.querySelector('.form-group button span').textContent.trim(),
        },
        {
          selectedOptions: Array.from(multipleSelect.selectedOptions).map(option => option.value),
          selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
        }
      ]
    }
    return [
      {
        selectedValue: null,
        label: document.querySelector('.form-group button span').textContent.trim(),
      },
      {
        selectedOptions: null,
        selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
      }
    ]
  });

  t.same(singleState.selectedValue, singleState.label, 'Le reset de formulaire change le texte du bouton d’ouverture')

  const selectedOptionsMatches = multipleState.selectedOptions.every((option, index) =>{
    return option === multipleState.selectedItems[index];
  })

  t.true(selectedOptionsMatches, 'Le reset de formulaire change la liste des éléments sélectionnés')

  await browser.close();

  t.end();
});
