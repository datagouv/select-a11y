# Select-a11y

**select-a11y** transforms selects (multiple or not) into suggestions list with search input. It is compliant with [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/intro/wcag) and [General Accessibility Framework for Administrations](https://disic.github.io/rgaa_referentiel_en/introduction-RGAA.html) (Référentiel général d'accessibilité pour les administrations - RGAA).

This fork is based on the [original select-a11y from Pidila](http://pidila.gitlab.io/select-a11y/).

To see the demo:
* download or clone this repository, then open the file /index.html ;

## References

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/
- http://pidila.gitlab.io/select-a11y/

## Use

All you need is the files in the `dist/` directory.

The source files are in the `src/` directory.

- Call the `dist/main.js` script in the bottom of your page in a `<script type="module">` or use a build system.

- Add the css or scss in your style files.
You can retrieve `dist/select-a11y.css`, an already compiled version.

To be transformed by select-a11y, you must call `new Select(select, options);` with your `HTMLSelectElement` as first parameter.


### Code sample

```html
<!-- select simple -->
<div class="form-group">
  <label for="select-option">Is your website…</label>
  <select class="form-control" id="select-option" data-select-a11y>
      <option>Perceivable</option>
      <option>Operable</option>
      <option>Understandable</option>
      <option>Robust</option>
  </select>
</div>

<!-- select multiple -->
<div class="form-group">
  <label for="select-element">What do you want to do today?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y data-placeholder="Search in list">
      <option>Sleeping</option>
      <option>Climbing trees</option>
      <option>Knitting</option>
      <option selected>Dancing with unicorns</option>
      <option>Dreaming</option>
  </select>
</div>
```

Then, add the following JavaScript code in one of your file (that must be after select-a11y script):

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  return new Select(select);
});
```

The default texts used for accessibility can be changed. When creating a new select a11y, you can pass an object containing the `text` property as a second parameter:

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  new Select(select, {
    text:{
      help: 'Utilisez la tabulation (ou la touche flèche du bas) pour naviguer dans la liste des suggestions',
      placeholder: 'Rechercher dans la liste',
      noResult: 'Aucun résultat',
      results: '{x} suggestion(s) disponibles',
      deleteItem: 'Supprimer {t}',
      delete: 'Supprimer'
    }
  })
});
```

The texts in the example are the default texts used in the script.

## Contribute

This project is under Test Driven Development with vitest.

Requisite: Node.js >=16.3.0 and npm globally installed.

### Installation and development

After cloning this repository, install dependencies:

```bash
$ npm install
```

#### Display locally

```bash
$ vite
```

This task launches the server to display the page locally and recompiling sources on the fly if modified.

#### Run tests

```bash
npm run test:watch
# or
npm run test:build
```

#### Publish a new version of the package

Change the version and make a new tag :
```
npm version [semver change required like major, minor or patch]
```

Push new tag :
```
git push origin [your new tag]
```

Publish on NPM :
```
npm run publish-version
```

#### Publish a preversion of the package

You can follow the same steps as above with prepatch, preminor, premajor or prerelease as an argument to the `npm version` command.


## Content of the repository

* example/ : demo its assets
  * assets/css : the compiled css
  * assets/img : the images (only used for demo)
  * assets/scripts : the select-a11y.js script and instantiation for the demo in main.js
  * assets/scss : sass sources for the demo page (style.scss imports styles dedicated to select-a11y + demo specific styles)
* index.html : html source of the demo page
* src/ : source files (js and sass)
* tests/ : index.js to run the tests

## Authors

DINUM

Previous developpers and reviewers: Alain Batifol, Thomas Beduneau, Nicolas Bovorasmy, Anne Cavalier, Laurent Dutheil, Lucile Houdinet, Aurélien Lévy, Hugues Moreno - For the DILA, Direction de l'information légale et administrative.

## License

MIT and [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). Feel free to use it with one or the other.
