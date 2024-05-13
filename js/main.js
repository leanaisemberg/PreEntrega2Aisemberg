// Informacion de los Pokemones iniciales
const pokemonInfo = [
    {id: 1, nombre: 'Bulbasaur', tipo: 'planta', sprite:'./img/1.png', generacion: 1 },
    {id: 2, nombre: 'Charmander', tipo: 'fuego', sprite:'./img/2.png', generacion: 1 },
    {id: 3, nombre: 'Squirtle', tipo: 'agua', sprite:'./img/3.png', generacion: 1 },
    {id: 4, nombre: 'Chikorita', tipo: 'planta', sprite:'./img/4.png', generacion: 2 },
    {id: 5, nombre: 'Cyndaquil', tipo: 'fuego', sprite:'./img/5.png', generacion: 2 },
    {id: 6, nombre: 'Totodile', tipo: 'agua', sprite:'./img/6.png', generacion: 2 },
    {id: 7, nombre: 'Treecko', tipo: 'planta', sprite:'./img/7.png', generacion: 3 },
    {id: 8, nombre: 'Torchic', tipo: 'fuego', sprite:'./img/8.png', generacion: 3 },
    {id: 9, nombre: 'Mudkip', tipo: 'agua', sprite:'./img/9.png', generacion: 3 },
]

// Evento principal
document.addEventListener('DOMContentLoaded', function() {
    const catchProbability = 0.35; // Probabilidad de atrapar
  
    const team = JSON.parse(localStorage.getItem('team')) || []; // Obtener el equipo del localStorage
    const teamLimit = 6; // Número máximo de Pokémon en el equipo
  
    const pokemonIdInput = document.getElementById('pokemonId');
    const messageText = document.querySelector('.message');
    const teamList = document.getElementById('teamList');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmCatchButton = document.getElementById('confirmCatchButton');
    const cancelCatchButton = document.getElementById('cancelCatchButton');
    const resetButton = document.getElementById('resetButton');

    // Evento click "Reiniciar equipo"
    resetButton.addEventListener('click', function() {
      resetTeamAndPokeballs();
    });

    const pokeballsLeftText = document.querySelector('.pokeballs-left');

    let tries = 20; // Número máximo de intentos (Pokeballs)
    const pokeballPrice = 10; // Precio de cada Pokéball
    let pokeballsLeft = parseInt(localStorage.getItem('pokeballsLeft')) || tries; // Obtener las Pokébolas restantes del localStorage

    const catchButton = document.getElementById('catchButton');

    // Evento click "Lanzá una pokeball"
    catchButton.addEventListener('click', function() {
        const pokemonId = parseInt(pokemonIdInput.value);
        
        let pokemonElegido = getPokemonInfo (pokemonInfo, pokemonId) // Guarda pokemon elegido

        if (isNaN(pokemonId)) {
            showMessage('ID de Pokémon no válido. Por favor, introduce un valor numérico.');
            return;
        }

        if (pokeballsLeft > 0) {
            showConfirmationModal(pokemonElegido.name);
          } else {
            showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice} creditos cada una.`);
          }
    });

    // Evento click "Si"
    confirmCatchButton.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        const pokemonId = parseInt(pokemonIdInput.value);
        let pokemonElegido = getPokemonInfo(pokemonInfo, pokemonId)
        tryToCatchPokemon(pokemonElegido.id, pokemonElegido.name, pokemonElegido.type, pokemonElegido.sprite);
    });
    
    // Evento click "No"
    cancelCatchButton.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        showMessage('Decidiste no atrapar al Pokémon.');
    });

    // Funcion mostrar modal
    function showConfirmationModal(pokemonName) {
        const modalMessage = document.querySelector('.modal-message');
        modalMessage.textContent = `¿Estás seguro de que quieres atrapar a ${pokemonName}?`;
        confirmationModal.style.display = 'block';
    }

    // Funcion reiniciar todo
    function resetTeamAndPokeballs() {
        team.length = 0; // Vaciar el equipo
        pokeballsLeft = tries; // Restablecer las Pokébolas restantes
        
        saveTeamAndPokeballs(); // Guardar los cambios en el localStorage
      
        showMessage('El equipo y los intentos han sido reseteados.'); // Mostrar un mensaje de confirmación
      
        displayTeamMembers(); // Actualizar la visualización del equipo
        updatePokeballsLeftText(); // Actualizar el texto de las Pokébolas restantes
    }

    // Funcion simulador atrapador pokemon
    function tryToCatchPokemon(id, pokemonName, type, sprite) {
        if (pokeballsLeft > 0) {
          const isSuccess = Math.random() <= catchProbability;
    
          if (isSuccess && team.length < teamLimit) {
            team.push({name: pokemonName, type: type, sprite: sprite });
            showMessage(`¡Felicidades! Has atrapado a ${pokemonName} y lo has añadido a tu equipo.`);
          } else if (isSuccess && team.length >= teamLimit) {
            showMessage(`Tu equipo está lleno. No puedes atrapar más Pokémon.`);
          } else {
            showMessage(`¡Oh no! ${pokemonName} se ha escapado.`);
          }
    
          pokeballsLeft--;
          updatePokeballsLeftText();
    
          if (pokeballsLeft === 0) {
            showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice} creditos cada una.`);
          }
    
          saveTeamAndPokeballs(); // Guardar el equipo y las Pokébolas restantes en el localStorage
    
          displayTeamMembers();
        } else {
          showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice} creditos cada una.`);
        }
    }

    // Funcion para actualziar pokeballs
    function updatePokeballsLeftText() {
        pokeballsLeftText.textContent = `Pokéballs restantes: ${pokeballsLeft}`;
    }
  
    // Funcion para obtener pokemon y hacer un array
    function getPokemonInfo (array, numero) {
        let nombreParcial = array.filter((elemento) => {
            return elemento.id === numero 
        })  

        // En caso que no ingrese nada o algo incorrecto, se desbloquea un Easter Egg
        if (numero < 1 || numero > 9) {
            const pokemonName = 'Pikachu'
            const type = 'Electrico'
            const sprite = './img/0.png'   
            return {name: pokemonName, type: type, sprite: sprite}
        } else {
            const pokemonName = nombreParcial[0].nombre
            const type = nombreParcial[0].tipo
            const sprite = nombreParcial[0].sprite
            return {name: pokemonName, type: type, sprite: sprite}
        } 
    }
  
    // Funcion mensaje
    function showMessage(message) {
      messageText.textContent = message;
    }
  
    function displayTeamMembers() {
      teamList.innerHTML = ''; // Limpiar la lista de equipo
        
      
      if (team.length === 0) {
        return; // Salir si el equipo está vacío
      }
  
      const row = document.createElement('div');
      row.classList.add('col', 'card-grid');
  
      team.forEach(pokemon => {
        const col = document.createElement('div');
        col.classList.add('col-2');
  
        const card = document.createElement('div');
        card.classList.add('card', 'h-100');
  
        const pokemonSprite = document.createElement('img');
        pokemonSprite.classList.add('card-img-top');
        pokemonSprite.src = pokemon.sprite;
        card.appendChild(pokemonSprite);
  
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
  
        const pokemonName = document.createElement('h5');
        pokemonName.classList.add('card-title');
        pokemonName.textContent = pokemon.name;
        cardBody.appendChild(pokemonName);
  
        const pokemonType = document.createElement('p');
        pokemonType.classList.add('card-text');
        pokemonType.textContent = `Tipo: ${pokemon.type}`;
        cardBody.appendChild(pokemonType);
  
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
      });
  
      teamList.appendChild(row);
    }
  
    function saveTeamAndPokeballs() {
      localStorage.setItem('team', JSON.stringify(team)); // Guardar el equipo en el localStorage
      localStorage.setItem('pokeballsLeft', pokeballsLeft.toString()); // Guardar las Pokébolas restantes en el localStorage
    }
  
    updatePokeballsLeftText();
    displayTeamMembers();

  });
