import Select from "../../../src/select-a11y";
import "../scss/style.scss";

export default function createSelectA11ys() {
  /** @type NodeListOf<HTMLSelectElement> */
  var selects = document.querySelectorAll('select[data-select-a11y]');

  return Array.from(selects).map(function(select) {
    let options = {};
    if(select.dataset.hasOwnProperty("selectA11yLabel")) {
      options.useLabelAsButton = true;
      if(!select.querySelector('option[selected]')) {
        select.value = null;
      }
    }
    if(select.dataset.hasOwnProperty("selectA11yClearable")) {
      options.clearable = true;
    }
    return new Select(select, options);
  });
}

globalThis.selectA11ys = createSelectA11ys();

// Exemple d'instanciation avec le paramètre "text" des libellés d'aide du composant
/*
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
*/
