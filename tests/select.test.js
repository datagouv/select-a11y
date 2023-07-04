import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

describe('select-a11y', async () => {
  /**
   * @type {import("vite").PreviewServer}
   */
  let server;

  /**
   * @type {import("puppeteer").Browser}
   */
  let browser;

  /**
   * @type {import("puppeteer").Page}
   */
  let page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await puppeteer.launch({ dumpio: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await /** @type {Promise<void>} */(new Promise((resolve, reject) => {
      server.httpServer.close((/** @type {any} */ error) => error ? reject(error) : resolve());
    }));
  });


  const goToPage = async () => {
    await page.goto('http://127.0.0.1:3000');

    return { browser, page };
  };

  test('Creation du select-a11y simple', async () => {
    const { browser, page } = await goToPage();

    const wrapper = await page.$('body');
    expect(wrapper).toBeDefined();

    const body = await page.evaluate(() => {
      return document.querySelector("body");
    });

    const { label, select } = await page.evaluate(() => {
      const wrapper = document.querySelector('.form-group');
      const selectA11y = wrapper?.querySelector('.select-a11y');
      const label = wrapper?.firstElementChild;

      return {
        label: {
          stayed: label && label.getAttribute('for') === 'select-option',
          id: label && label.id
        },
        select: selectA11y !== null
      }
    });

    expect(label.stayed, 'Le label n’est pas déplacé').toBe(true);
    expect(select, 'Le conteneur de select-a11y est créé').toBe(true);

    const { tagHidden, live, button } = await page.evaluate(() => {
      const selectA11y = document.querySelector('.form-group > .select-a11y');
      const tagHidden = selectA11y?.querySelector('.select-a11y__hidden');
      const live = selectA11y?.querySelector('[aria-live]');
      const button = selectA11y?.querySelector('button[aria-expanded]');
      const label = selectA11y?.querySelector('label');

      return {
        tagHidden: {
          exists: tagHidden !== null,
          isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
          select: tagHidden && tagHidden.firstElementChild?.tagName
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

    expect(tagHidden.exists, 'Le conteneur du select original est créé').toBe(true);
    expect(tagHidden.select, 'Le conteneur du select original contient bien le select original').toBe("SELECT");
    expect(tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran').toBe(true);

    expect(live.exists, 'L‘élément de restitution vocal est créé').toBe(true);
    expect(live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »').toBe(true);

    expect(button.exists, 'Le bouton permettant d’ouvrir le select est créé').toBe(true);
    expect(button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut').toBe(true);
    expect(button.labelledby?.includes(label.id ?? ""), 'Le bouton est lié au label via l’attribut « aria-labelledby »').toBe(true);
  });

  test('Programmatically assign value to select-a11y', async () => {
    const { browser, page } = await goToPage();

    const { selectedOption, value, changed } = await page.evaluate(() => {
      let select = document.querySelector('.form-group select[data-select-a11y]');
      let changed = false;
      if (select instanceof HTMLSelectElement) {
        const selectA11y = globalThis.selectA11ys?.shift();
        select.addEventListener('change', () => changed = true);
        const item = select.options.item(2);
        selectA11y.selectOption(item?.value);
        const button = document.querySelector('.form-group button');
        return {
          selectedOption: item?.label,
          value: button?.firstElementChild?.textContent?.trim(),
          changed,
        }
      }
    }) ?? {};

    expect(value, 'Programmatically selecting an option updates <select> value').toBe(selectedOption);
    expect(changed, 'Programmatically selecting an option dispatch change event').toBe(true);
  });

  test('Programmatically assign value to select-a11y', async () => {
    const { browser, page } = await goToPage();

    const { selectedOption, value, changed } = await page.evaluate(() => {
      let select = document.querySelector('.form-group select[data-select-a11y]');
      let changed = false;
      if (select instanceof HTMLSelectElement) {
        const selectA11y = window.selectA11ys?.shift();
        const item = select.options.item(2);
        select.addEventListener('change', () => changed = true);
        selectA11y.selectOptionSilently(item?.value);
        const button = document.querySelector('.form-group button');
        return {
          selectedOption: item?.label,
          value: button?.firstElementChild?.textContent?.trim(),
          changed,
        }
      }
    }) ?? {};

    expect(value, 'Programmatically selecting an option updates <select> value').toBe(selectedOption);
    expect(changed, "selectOptionSilently doesn't dispatch change event").toBe(false);
  });

  test('Creation du select-a11y multiple', async () => {
    const { browser, page } = await goToPage();

    const { select } = await page.evaluate(() => {
      const wrapper = document.querySelector('.form-group');
      const selectA11y = wrapper?.querySelector('.select-a11y');

      return {
        select: selectA11y !== null
      }
    });

    expect(select, 'Le conteneur de select-a11y est créé').toBe(true);

    const { tagHidden, live, button } = await page.evaluate(() => {
      const selectA11y = document.querySelector('.form-group.multiple > .select-a11y');
      const tagHidden = selectA11y?.querySelector('.select-a11y__hidden');
      const live = selectA11y?.querySelector('[aria-live]');
      const button = selectA11y?.querySelector('button[aria-expanded]');

      return {
        tagHidden: {
          exists: tagHidden !== null,
          isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
          label: tagHidden && tagHidden.firstElementChild?.tagName,
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

    expect(tagHidden.exists, 'Le conteneur du select original est créé').toBe(true);
    expect(tagHidden.hasSelect, 'Le conteneur du select original contient bien le select original').toBe(true);
    expect(tagHidden.label, 'Le conteneur du select original contient bien le label du select original').toBe('LABEL');
    expect(tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran').toBe(true);

    expect(live.exists, 'L‘élément de restitution vocal est créé').toBe(true);
    expect(live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »').toBe(true);

    expect(button.exists, 'Le bouton permettant d’ouvrir le select est créé').toBe(true);
    expect(button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut').toBe(true);
  });

  test('État par défaut', async () => {
    const { browser, page } = await goToPage();

    const selects = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));

      return selects.map(select => {
        const wrapper = select.closest('.select-a11y');
        const label = document.querySelector(`label[for=${select.id}]`);
        const button = wrapper?.querySelector('button[aria-expanded]');

        if (select.multiple) {
          const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
          const listItems = Array.from(wrapper?.querySelectorAll('.select-a11y__selected-item') ?? [])?.map(item => item.firstElementChild?.textContent?.trim());

          return {
            multiple: true,
            label: label?.textContent?.trim(),
            buttonLabel: button?.textContent?.trim(),
            values: selectedValues.join(':'),
            listItems: listItems.join(':'),
          }
        }
        else {
          return {
            multiple: false,
            useLabelAsButton: select.dataset.hasOwnProperty("selectA11yLabel"),
            label: label?.textContent?.trim(),
            buttonLabel: button?.textContent?.trim(),
            value: select.value,
            option: select?.item(select.selectedIndex)?.text,
          }
        }
      });
    });

    selects.forEach(select => {
      if (select.multiple) {
        expect(select.label, 'Le select multiple affiche le label dans le bouton d’ouverture').toBe(select.buttonLabel);
        expect(select.listItems, 'Le select multiple affiche une liste des éléments sélectionnés par défaut').toBe(select.values);
      } else {
        if (select.useLabelAsButton && !select.value) {
          expect(select.label, 'Le select multiple affiche le label dans le bouton d’ouverture').toBe(select.buttonLabel);
        } else {
          expect(select.buttonLabel, 'Le select affiche la valeur de l’élément sélectionné par défaut dans le bouton d’ourerture').toBe(select.option);
        }
      }
    });
  });

  test('Création de la liste lors de l’ouverture du select simple', async () => {
    const { browser, page } = await goToPage();

    await page.click('.form-group button');

    const data = await page.evaluate(() => {
      const wrapper = document.querySelector('.select-a11y');
      const select = wrapper?.querySelector('select');
      const container = document.querySelector('.select-a11y__overlay');
      const help = container?.firstElementChild;
      const label = container?.querySelector('label');
      const input = container?.querySelector('input');
      const options = container?.querySelectorAll('[role="option"]');
      const listBox = container?.querySelector('[role="listbox"]');

      return {
        hasContainer: wrapper?.contains(container),
        help: {
          isParagraph: help?.tagName === 'P',
          id: help?.id
        },
        label: {
          for: label?.getAttribute('for')
        },
        input: {
          id: input?.id,
          describedby: input?.getAttribute('aria-describedby')
        },
        list: {
          length: options?.length
        },
        options: {
          length: select?.options.length
        },
        listBox: {
          multiple: listBox?.hasAttribute('aria-multiselectable')
        },
      }
    });

    expect(data.hasContainer, 'La liste est créée lors de l’activation du bouton').toBe(true);
    expect(data.help.isParagraph, 'Le texte explicatif est présent').toBe(true);
    expect(data.help.id, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »').toBe(data.input.describedby);
    expect(data.label.for, 'Le label est lié au champ de recherche via l’attribut « for »').toBe(data.input.id);
    expect(data.list.length, 'La liste créée contient le même nombre d’options que le select').toBe(data.options.length);
    expect(data.listBox.multiple, 'La liste pour le select ne contient pas d’attribut « aria-multiselectable »').toBe(false);
  });

  test('Création de la liste lors de l’ouverture du select simple avec affichage du label dans le bouton', async () => {
    const { browser, page } = await goToPage();

    await page.click('.label button');

    const data = await page.evaluate(() => {
      const wrapper = document.querySelector('.label .select-a11y');
      const select = wrapper?.querySelector('select');
      const container = document.querySelector('.select-a11y__overlay');
      const help = container?.firstElementChild;
      const label = container?.querySelector('label');
      const input = container?.querySelector('input');
      const options = container?.querySelectorAll('[role="option"]');
      const listBox = container?.querySelector('[role="listbox"]');

      return {
        hasContainer: wrapper?.contains(container),
        help: {
          isParagraph: help?.tagName === 'P',
          id: help?.id
        },
        label: {
          for: label?.getAttribute('for')
        },
        input: {
          id: input?.id,
          describedby: input?.getAttribute('aria-describedby')
        },
        list: {
          length: options?.length
        },
        options: {
          length: select?.options.length
        },
        listBox: {
          multiple: listBox?.hasAttribute('aria-multiselectable')
        },
      }
    });

    expect(data.hasContainer, 'La liste est créée lors de l’activation du bouton').toBe(true);
    expect(data.help.isParagraph, 'Le texte explicatif est présent').toBe(true);
    expect(data.help.id, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »').toBe(data.input.describedby);
    expect(data.label.for, 'Le label est lié au champ de recherche via l’attribut « for »').toBe(data.input.id);
    expect(data.list.length, 'La liste créée contient une option de moins que le select, celle ajoutée par select-a11y').toBe((data.options?.length ?? 0) - 1);
    expect(data.listBox.multiple, 'La liste pour le select ne contient pas d’attribut « aria-multiselectable »').toBe(false);
  });

  test('Création de la liste lors de l’ouverture du select multiple', async () => {
    const { browser, page } = await goToPage();

    await page.click('.multiple button');

    const data = await page.evaluate(() => {
      const wrapper = document.querySelector('.multiple .select-a11y');
      const select = wrapper?.querySelector('select');
      const container = document.querySelector('.multiple .select-a11y__overlay');
      const help = container?.firstElementChild;
      const label = container?.querySelector('label');
      const input = container?.querySelector('input');
      const options = container?.querySelectorAll('[role="option"]');
      const listBox = container?.querySelector('[role="listbox"]');

      return {
        hasContainer: wrapper?.contains(container),
        help: {
          isParagraph: help?.tagName === 'P',
          id: help?.id
        },
        label: {
          for: label?.getAttribute('for')
        },
        input: {
          id: input?.id,
          describedby: input?.getAttribute('aria-describedby')
        },
        list: {
          length: options?.length
        },
        options: {
          length: select?.options.length
        },
        listBox: {
          multiple: listBox?.getAttribute('aria-multiselectable')
        },
      }
    });

    expect(data.hasContainer, 'La liste est créée lors de l’activation du bouton').toBe(true);
    expect(data.help.isParagraph, 'Le texte explicatif est présent').toBe(true);
    expect(data.help.id, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »').toBe(data.input.describedby);
    expect(data.label.for, 'Le label est lié au champ de recherche via l’attribut « for »').toBe(data.input.id);
    expect(data.list.length, 'La liste crée contient le même nombre d’options que le select').toBe(data.options.length);
    expect(data.listBox.multiple, 'La liste pour le select contient l’attribut « aria-multiselectable »').toBe("true");
  });

  test('Création de la liste lors de l’ouverture du select avec image', async () => {
    const { browser, page } = await goToPage();

    await page.click('.images button');

    const data = await page.evaluate(() => {
      const wrapper = document.querySelector('.images .select-a11y');
      const select = wrapper?.querySelector('select');
      const container = document.querySelector('.images .select-a11y__overlay');
      const help = container?.firstElementChild;
      const label = container?.querySelector('label');
      const input = container?.querySelector('input');
      const options = container?.querySelectorAll('[role="option"]');
      const listBox = container?.querySelector('[role="listbox"]');

      return {
        hasContainer: wrapper?.contains(container),
        help: {
          isParagraph: help?.tagName === 'P',
          id: help?.id
        },
        label: {
          for: label?.getAttribute('for')
        },
        input: {
          id: input?.id,
          describedby: input?.getAttribute('aria-describedby')
        },
        list: {
          length: options?.length,
          lengthWithImage: Array.from(options ?? []).filter(option => option.querySelector('img')).length,
          lengthWithAlt: Array.from(options ?? []).filter(option => {
            const img = option.querySelector('img');
            const alt = img?.getAttribute('alt');
            return img && alt && alt !== '';
          }).length,
        },
        options: {
          length: select?.options?.length,
          lengthWithImage: Array.from(select?.options ?? []).filter(option => option.dataset.image).length,
          lengthWithAlt: Array.from(select?.options ?? []).filter(option => option.dataset.image && option.dataset.alt).length,
        },
        listBox: {
          multiple: listBox?.getAttribute('aria-multiselectable')
        },
      }
    });

    expect(data.hasContainer, 'La liste est créée lors de l’activation du bouton').toBe(true);
    expect(data.help.isParagraph, 'Le texte explicatif est présent').toBe(true);
    expect(data.help.id, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »').toBe(data.input.describedby);
    expect(data.label.for, 'Le label est lié au champ de recherche via l’attribut « for »').toBe(data.input.id);
    expect(data.list.length, 'La liste crée contient le même nombre d’options que le select').toBe(data.options.length);
    expect(data.listBox.multiple, 'La liste pour le select contient l’attribut « aria-multiselectable »').toBe("true");
    expect(data.list.lengthWithImage, 'La liste crée contient des images si les options contiennent un data-image').toBe(data.options.lengthWithImage);
    expect(data.list.lengthWithAlt, 'La liste crée contient des images avec attribut alt si les options contiennent un data-image et un data-alt').toBe(data.options.lengthWithAlt);
  });

  test('Gestion du champ de recherche', async () => {
    const { browser, page } = await goToPage();

    await page.click('.multiple button');

    await page.type('#a11y-select-element-js', 'ee');

    await page.keyboard.press('ArrowDown');

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await page.waitForTimeout(10);

    const data = await page.evaluate(() => {
      const input = document.getElementById('a11y-select-element-js');
      const activeElement = document.activeElement;
      const options = document.querySelectorAll('.multiple [role="option"]')
      if (input instanceof HTMLInputElement) {
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

    expect(data.focused, 'Le focus est dans le champ').toBe(true);
    expect(data.selectionStart, 'Le focus ne sélectionne pas le texte du champ').toBe(data.selectionEnd);
    expect(data.selectionStart, 'Le curseur est positionné en fin de texte').toBe(data.length);
    expect(data.displayedOptions, 'La liste des options est filtrée lorsque qu’un texte est saisi dans le champ').toBe(2);

    await page.type('#a11y-select-element-js', 'eee');

    const noResult = await page.evaluate(() => {
      return document.querySelectorAll('.multiple .select-a11y__no-suggestion') !== undefined
    });

    expect(noResult, 'La liste affiche un message d’erreur lorsqu’il n’y a pas d’option s’approchant du texte saisi dans le champ').toBe(true);
  });

  test('Gestion de la selection au clavier d’un select', async () => {
    const { browser, page } = await goToPage();

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

      if (select instanceof HTMLSelectElement) {
        return {
          closed: button?.getAttribute('aria-expanded') === 'false',
          focus: activeElement === button,
          selectedLabel: [button?.firstElementChild?.textContent?.trim()],
          selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
        }
      }
      return {
        closed: button?.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        selectedLabel: [button?.firstElementChild?.textContent?.trim()],
      }
    });

    expect(spacePressed.closed, 'L’appui sur la barre d’espace sur une option ferme la liste des options').toBe(true);
    expect(spacePressed.focus, 'L’appui sur la barre d’espace sur une option rend le focus au bouton d’ouverture').toBe(true);
    expect(spacePressed.selectedOptions?.length, 'Le select comporte une options sélectionnée').toBe(1);
    expect(spacePressed.selectedLabel, 'L’appui sur la barre d’espace sur une option sélectionne l’option').toStrictEqual(spacePressed.selectedOptions);

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

      if (select instanceof HTMLSelectElement) {
        return {
          closed: button?.getAttribute('aria-expanded') === 'false',
          focus: activeElement === button,
          active: activeElement?.tagName,
          selectedLabel: [button?.firstElementChild?.textContent?.trim()],
          selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
        }
      }
      return {
        closed: button?.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        active: activeElement?.tagName,
        selectedLabel: [button?.firstElementChild?.textContent?.trim()],
      }
    });

    expect(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options').toBe(true);
    expect(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture').toBe(true);
    expect(enterPressed.selectedOptions?.length, 'Le select comporte une options sélectionnée').toBe(1);
    expect(enterPressed.selectedLabel, 'L’appui sur la touche entrée sur une option sélectionne l’option').toStrictEqual(enterPressed.selectedOptions);
  });

  test('Gestion de la selection au clavier d’un select multiple', async () => {
    const { browser, page } = await goToPage();

    await page.focus('.form-group.multiple button');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForTimeout(10);

    const spacePressed = await page.evaluate(() => {
      const button = document.querySelector('.multiple button');
      const select = document.querySelector('.multiple select');
      const activeElement = document.activeElement;

      if (select instanceof HTMLSelectElement) {
        return {
          open: button?.getAttribute('aria-expanded') === 'true',
          selected: activeElement?.getAttribute('aria-selected') === 'true',
          selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
        }
      }
      return {
        open: button?.getAttribute('aria-expanded') === 'true',
        selected: activeElement?.getAttribute('aria-selected') === 'true',
      }
    });

    expect(spacePressed.open, 'L’appui sur la barre d’espace sur une option ne ferme pas la liste des options d’un select multiple').toBe(true);
    expect(spacePressed.selected, 'L’appui sur la barre d’espace sur une option sélectionne l’option').toBe(true);
    expect(spacePressed.selectedOptions?.length, 'Le select comporte 2 options sélectionnées').toBe(2);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10);

    const enterPressed = await page.evaluate(() => {
      const button = document.querySelector('.multiple button');
      const select = document.querySelector('.multiple select');
      const activeElement = document.activeElement;
      const list = Array.from(document.querySelectorAll('.multiple .select-a11y__selected-list li'));

      if (select instanceof HTMLSelectElement) {
        return {
          closed: button?.getAttribute('aria-expanded') === 'false',
          focus: activeElement === button,
          selectedItems: list.map(item => item.firstElementChild?.textContent?.trim()),
          selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
        }
      }
      return {
        closed: button?.getAttribute('aria-expanded') === 'false',
        focus: activeElement === button,
        selectedItems: list.map(item => item.firstElementChild?.textContent?.trim()),
      }
    });

    expect(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options').toBe(true);
    expect(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture').toBe(true);
    expect(enterPressed.selectedOptions?.length, 'Le select comporte 2 options sélectionnées').toBe(2);
    expect(enterPressed.selectedItems, 'L’appui sur la touche entrée sur une option sélectionne l’option').toStrictEqual(enterPressed.selectedOptions);
  });

  test('Suppression des options via la liste des options sélectionnées', async () => {
    const { browser, page } = await goToPage();

    await page.click('.multiple button');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter');

    await page.focus('.select-a11y__selected-list .select-a11y__selected-item:nth-child(3) button');
    await page.keyboard.press('Enter');

    const secondButtonFocused = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y__selected-list .select-a11y__selected-item:nth-child(2) button');
    });

    expect(secondButtonFocused, 'Le focus est placé sur le bouton précédant dans l’ordre du document lors de la suppression').toBe(true);

    await page.focus('.select-a11y__selected-list .select-a11y__selected-item:nth-child(1) button');
    await page.keyboard.press('Enter');

    const firstButtonFocused = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y__selected-list .select-a11y__selected-item:nth-child(1) button');
    });

    expect(firstButtonFocused, 'Le focus est placé sur le premier bouton dans l’ordre du document lors de la suppression du premier bouton').toBe(true);

    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    const openerFocused = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.multiple button');
    });

    expect(openerFocused, 'Le focus est placé sur le bouton d’ouverture du select lorsque tous les boutons de suppression ont disparu').toBe(true);
  });

  test('Gestion de la liste au blur', async () => {
    const { browser, page } = await goToPage();

    await page.click('.multiple button');

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    const buttonFocus = await page.evaluate(() => {
      const button = document.activeElement;

      return {
        isButton: document.activeElement === document.querySelector('.multiple button'),
        expanded: button?.getAttribute('aria-expanded')
      }
    });

    expect(buttonFocus.isButton && buttonFocus.expanded, 'La liste reste ouverte lorsque le bouton d’ouverture à la focus').toBe("true");

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await page.waitForTimeout(10);

    const buttonBlurTopExpanded = await page.evaluate(() => {
      const button = document.querySelector('.multiple button');
      return button?.getAttribute('aria-expanded');
    });

    expect(buttonBlurTopExpanded, 'La liste est fermée lorsque le focus est en dehors du select').toBe("false");

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
      const selected = document.querySelector('.multiple .select-a11y__selected-item button');

      return {
        expanded: button?.getAttribute('aria-expanded'),
        selectionFocused: selected === document.activeElement
      }
    });

    expect(select.selectionFocused && select.expanded, 'La liste est fermée lorsque le focus est sur les boutons de la liste de sélection').toBe("false");

    await page.click('.multiple button');
    await page.waitForTimeout(10);
    await page.click('body')
    await page.waitForTimeout(20);

    const focused = await page.evaluate(() => {
      const button = document.querySelector('.multiple button');
      return button === document.activeElement
    });

    expect(focused, 'La liste est fermée lorsqu’on clique en dehors').toBe(true);
  });

  test('Gestion de la liste du select simple au clic', async () => {
    const { browser, page } = await goToPage();

    await page.click('.form-group button');
    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');
    await page.waitForTimeout(10);

    const clickStatus = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const opener = document.querySelector('.form-group button');

      return {
        expanded: opener?.getAttribute('aria-expanded'),
        openerFocused: opener === activeElement
      }
    });

    expect(clickStatus.expanded, 'La liste est refermée après un clic sur une option').toBe("false");
    expect(clickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste').toBe(true);

    await page.click('.form-group button');

    await page.keyboard.down('Meta');
    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');
    await page.keyboard.up('Meta');

    await page.waitForTimeout(10);

    const metaClickStatus = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const opener = document.querySelector('.form-group button');

      return {
        expanded: opener?.getAttribute('aria-expanded'),
        openerFocused: opener === activeElement
      }
    });

    expect(metaClickStatus.expanded, 'La liste est refermée après un meta + clic sur une option').toBe("false");
    expect(metaClickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste').toBe(true);
  });

  test('Gestion de la liste du select multiple au clic', async () => {
    const { browser, page } = await goToPage();

    await page.click('.multiple button');

    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');

    await page.waitForTimeout(10);

    const clickStatus = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const opener = document.querySelector('.multiple button');

      return {
        expanded: opener?.getAttribute('aria-expanded'),
        openerFocused: opener === activeElement
      }
    });

    expect(clickStatus.expanded, 'La liste est refermée après un clic sur une option').toBe("false");
    expect(clickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste').toBe(true);

    await page.click('.multiple button');

    await page.keyboard.down('Meta');
    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');
    await page.keyboard.up('Meta');

    await page.waitForTimeout(10);

    const metaClickStatus = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const opener = document.querySelector('.form-group button');
      const option = document.querySelector('.select-a11y-suggestions [role="option"]:nth-child(2')

      return {
        expanded: opener?.getAttribute('aria-expanded'),
        optionFocused: option === activeElement
      }
    });

    expect(metaClickStatus.expanded, 'La liste n’est pas refermée après un meta + clic sur une option').toBe("false");
    expect(metaClickStatus.optionFocused, 'Le focus reste sur l’option cliquée').toBe(true);
  });

  test('Navigation au clavier', async () => {
    const { browser, page } = await goToPage();

    await page.focus('.form-group button');

    await page.keyboard.press('Enter');

    await page.keyboard.press('ArrowDown');

    const firstElementSelected = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
    });

    expect(firstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste').toBe(true);

    await page.keyboard.press('ArrowUp');

    const lastElementSelected = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(4)');
    });

    expect(lastElementSelected, 'La touche « flèche haut » déplace le focus sur le dernier élément de la liste lorsque le premier élément à le focus').toBe(true);

    await page.keyboard.press('ArrowDown');

    const backToFirstElementSelected = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
    });

    expect(backToFirstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste lorsque le dernier élément à le focus').toBe(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    const nextElement = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(3)');
    });

    expect(nextElement, 'La touche « flèche bas » déplace le focus sur l’élement suivant').toBe(true);

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    const previous = await page.evaluate(() => {
      return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
    });

    expect(previous, 'La touche « flèche haut » déplace le focus sur l’élement précédent').toBe(true);
  });

  test('Reset du formulaire', async () => {
    const { browser, page } = await goToPage();

    await page.click('.form-group button');

    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');

    await page.waitForTimeout(10);

    await page.click('.multiple button');

    await page.click('.select-a11y-suggestions [role="option"]:nth-child(2)');

    await page.waitForTimeout(10);

    await page.click('[type="reset"]');

    await page.waitForTimeout(50);

    const { singleState, multipleState } = await page.evaluate(() => {
      const singleSelect = document.querySelector('.form-group select');
      const multipleSelect = document.querySelector('.multiple select');
      const list = Array.from(document.querySelectorAll('.multiple .select-a11y__selected-list li'));
      const singleState = {};
      const multipleState = {};
      if (singleSelect instanceof HTMLSelectElement) {
        singleState.selectedValue = singleSelect.value;
        singleState.selectedOption = singleSelect.item(singleSelect.selectedIndex)?.label;
        singleState.label = document.querySelector('.form-group button span')?.textContent?.trim();
      }
      if (multipleSelect instanceof HTMLSelectElement) {
        multipleState.selectedOptions = Array.from(multipleSelect.selectedOptions).map(option => option.value);
        multipleState.selectedItems = list.map(item => item.firstElementChild?.textContent?.trim());
      }
      return { singleState, multipleState };
    });
    expect(singleState.selectedOption, 'Le reset de formulaire change le texte du bouton d’ouverture').toBe(singleState.label);
    const selectedOptionsMatches = multipleState.selectedOptions.every((option, index) => {
      return option === multipleState.selectedItems[index];
    });

    expect(selectedOptionsMatches, 'Le reset de formulaire change la liste des éléments sélectionnés').toBe(true);
  })
});
