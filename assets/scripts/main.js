// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1. Controlla se 'serviceWorker' è supportato dal browser corrente
  if ('serviceWorker' in navigator) {
    // B2. Ascolta l'evento 'load' sull'oggetto window.
    window.addEventListener('load', async () => {
      try {
        // B3. Registra './sw.js' come service worker
        const registration = await navigator.serviceWorker.register('./sw.js');
        
        // B4. Una volta che il service worker è stato registrato con successo, fai un log
        console.log('ServiceWorker registrato con successo. Scope: ', registration.scope);
      } catch (error) {
        // B5. Nel caso in cui la registrazione fallisca, fai un log dell'errore
        console.error('Registrazione del ServiceWorker fallita: ', error);
      }
    });
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
// A1. Controlla il local storage per vedere se ci sono ricette. 
  // Se ci sono, restituiscile in formato JSON (oggetto).
  const localRecipes = localStorage.getItem('recipes');
  if (localRecipes) {
    return JSON.parse(localRecipes);
  }

  // A2. Crea un array vuoto per contenere le ricette che andrai a recuperare
  const recipes = [];

  // A3. Ritorna una nuova Promise
  return new Promise(async (resolve, reject) => {
    // A5. Poiché stiamo gestendo codice asincrono, creiamo un blocco try / catch.
    try {
      // A4. Fai un ciclo per ogni ricetta nell'array costante RECIPE_URLS dichiarato in alto
      for (let i = 0; i < RECIPE_URLS.length; i++) {
        // A6. Per ogni URL, usa fetch per ottenere i dati (ASINCRONO)
        const response = await fetch(RECIPE_URLS[i]);
        
        // A7. Recupera il JSON dalla risposta (ASINCRONO)
        const recipeData = await response.json();
        
        // A8. Aggiungi la nuova ricetta all'array recipes
        recipes.push(recipeData);
      }
      
      // A9. Se hai finito di recuperare tutte le ricette, salvale nello storage e risolvi la Promise
      saveRecipesToStorage(recipes);
      resolve(recipes);
      
    } catch (error) {
      // A10. Fai un log di eventuali errori
      console.error('Errore durante il fetch delle ricette:', error);
      
      // A11. Passa gli errori alla funzione reject della Promise
      reject(error);
    }
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}