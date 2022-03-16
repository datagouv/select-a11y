# Select-a11y

* ******************************************** *
* [English version of this page](readme-en.md) *
* ******************************************** *

## Présentation

**select-a11y** est un script javascript associé à des css qui transforme un select (multiple ou non) en liste de suggestions avec champ de recherche à l'intérieur de cette liste. Il est conforme aux [Web Content Accessibility Guidelines (WCAG) (en)](https://www.w3.org/WAI/intro/wcag) et au [Référentiel général d'accessibilité pour les administrations (RGAA)](https://references.modernisation.gouv.fr/rgaa-accessibilite/).

Pour voir la démo, trois solutions sont offertes :

* consulter la [démo en ligne](http://pidila.gitlab.io/select-a11y/) ;
* télécharger ou cloner ce dépôt et ouvrir le fichier public/index.html ;
* installer en local en clonant ce dépôt puis en lançant les commandes `$ npm install` puis `$ gulp dev`.

**select-a11y** fait partie de [Scampi](https://gitlab.com/pidila/scampi), la bibliothèque de composants accessibles développée par le Pôle intégration html de la Direction de l'information légale et administrative (DILA). Il a été initialement développé pour le site service-public.fr, le site officiel de l'administration française. On peut le voir en action sur les filtres de recherche de [cette page](https://www.service-public.fr/demarches-silence-vaut-accord/recherche).

### Références

- https://select2.github.io/examples.html
- https://a11y.nicolas-hoffmann.net/autocomplet-list/

## Mise en oeuvre

Les fichiers source sont dans le répertoire src/.

Les fichiers nécessaires à la mise en œuvre sont placés dans le répertoire public/assets/scripts/. 

* Le script select-a11y.js doit être appelé en pied de page, juste avant le tag de fermeture du body, ou compilé avec vos autres scripts.
* Les styles scss dans vos fichiers de style ; pour récupérer une version déjà compilée, prendre le fichier public/assets/css/select-a11y.css.

Pour être pris en compte et transformé par le script select-a11y.js, le plus simple est d'ajouter un attribut (par exemple ```data-select-a11y```) dans la balise ```select``` qu'on veut transformer.


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
  <label for="select-element">Que voulez-vous faire aujourd'hui ?</label>
  <select class="form-control" id="select-element" multiple data-select-a11y data-placeholder="Chercher dans la liste">
      <option>Dormir</option>
      <option>Grimper aux arbres</option>
      <option>Tricoter</option>
      <option selected>Danser avec les licornes</option>
      <option>Rêver</option>
  </select>
</div>
```

On ajoute ensuite le code javascript suivant dans le fichier javascript du projet (impérativement après le script select-a11y) :

```js
var selects = document.querySelectorAll('select[data-select-a11y]');

var selectA11ys = Array.prototype.map.call(selects, function(select){
  return new Select(select);
});
```

Il est possible de changer les textes des libellés d'aide du composant. Pour cela on ajoute un second paramètre à  `new Select` contenant uniquement les textes à modifier comme dans l'exemple ci-dessous :

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

Les textes ci-dessus sont les textes utilisés par défaut.


## Contribute

Ce projet est développé en Test Driven Development avec tape.

Prérequis : nodejs 10.x, npm et gulp 3.x installé en global.

### Installation et développement

Après avoir cloné ce dépôt, installer les dépendances :

```bash
$ npm install
```

#### Afficher en local (localhost:3000)

```bash
$ gulp
```

Cette tâche enchaîne les tâches `gulp build` (compilation des sources et envoi vers le répertoire de démo) et `gulp dev` (lancement du serveur pour afficher la page en local et recompilation des sources à la volée si modifiées).

#### Lancer les tests :

```bash
$ npm test
```

## Contenu du dépôt

* public/ : page de démonstration et ses assets
  * assets/css les css compilées
  * assets/img les images (seulement utilisées pour la démo)
  * assets/scripts : le script select-a11y.js et l'instanciation pour la démo dans main.js
  * assets/scss/ : sources sass pour la page de démo (style.scss importe les styles dédiés à select-a11y + les styles spécifiques à la démo)
  * index.html : source html de la page de démonstration
* src/ : fichiers source (js et sass)
* tests/ : index.js pour faire tourner les tests

***Note importante :*** ne pas modifier directement le fichier assets/scripts/select-a11y.js ni les fichiers contenus dans assets/css/ : ils sont générés par les tâches de build.

### Comment puis-je aider ?

- fermer des tickets
- tester et signaler des bugs
- proposer des améliorations
- traduire ou relire la doc en anglais
- améliorer la documentation (en anglais ou en français)

## Auteurs

Développement et revue : Alain Batifol, Thomas Beduneau, Nicolas Bovorasmy, Anne Cavalier, Benoît Dequick, Laurent Dutheil, Lucile Houdinet, Aurélien Lévy, Hugues Moreno, Damien Petton - Pour la DILA, Direction de l'information légale et administrative.

## License

Le projet original **select-a11y** est distribué sous une double licence MIT et [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html). select-a11y peut être réutilisé avec l'une ou l'autre licence.