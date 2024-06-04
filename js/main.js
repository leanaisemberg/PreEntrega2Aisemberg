// Evento principal
document.addEventListener('DOMContentLoaded', function () {
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
  resetButton.addEventListener('click', function () {
    resetTeamAndPokeballs();
  });

  const pokeballsLeftText = document.querySelector('.pokeballs-left');

  let tries = 20; // Número máximo de intentos (pokeballs)
  const pokeballPrice = 10; // Precio de cada Pokéball
  let pokeballsLeft = parseInt(localStorage.getItem('pokeballsLeft')) || tries; // Obtener las Pokébolas restantes del localStorage

  const catchButton = document.getElementById('catchButton');

  // Evento click "Lanzá una pokeball"
  catchButton.addEventListener('click', function () {
    const pokemonId = parseInt(pokemonIdInput.value);

    if (isNaN(pokemonId)) {
      showMessage('ID de Pokémon no válido. Por favor, introduce un valor numérico.');
      return;
    }

    if (pokemonId < 1 || pokemonId > 1025) {
      showMessage('ID de Pokémon no válido. Por favor, introduce un valor entre 1 y 1025.');
      return;
    }

    if (pokeballsLeft > 0) {
      getPokemonInfo(pokemonId)
        .then(pokemonElegido => {
          showConfirmationAlert(pokemonElegido.name);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice}$ cada una.`);
    }
  });

  // Funcion mostrar alert
  function showConfirmationAlert(pokemonName) {
    const modalMessage = document.querySelector('.modal-message');

    Swal.fire({
      title: `¿Estás seguro de que quieres atrapar a ${pokemonName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: `<button id="cancelCatchButton" class="btn-alert">No</button>`,
      confirmButtonText: `<button id="confirmCatchButton" class="btn-alert">Si</button>`,
      customClass: {
        popup: 'alert'
      }

    }).then((result) => {

      // Evento click "Si"
      if (result.isConfirmed) {
        const pokemonId = parseInt(pokemonIdInput.value);
        getPokemonInfo(pokemonId)
          .then(pokemonElegido => {
            tryToCatchPokemon(pokemonElegido.name, pokemonElegido.type, pokemonElegido.sprite);
          })
          .catch(error => {
            console.error('Error:', error);
          });

        // Evento click "No"
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: `Decidiste no atrapar a ${pokemonName}.`,
          icon: "info",
          customClass: {
            popup: 'alert'
          }
        });
      }
    });
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
  function tryToCatchPokemon(pokemonName, pokemonType, pokemonSprite) {
    if (pokeballsLeft > 0) {
      const isSuccess = Math.random() <= catchProbability;

      // Caso catch satisfactorio
      if (isSuccess && team.length < teamLimit) {
        team.push({ name: pokemonName, type: pokemonType, sprite: pokemonSprite });
        Swal.fire({
          title: "¡Felicidades!",
          text: `Has atrapado a ${pokemonName} y lo has añadido a tu equipo.`,
          icon: "success",
          customClass: {
            popup: 'alert'
          }
        });
        showMessage('');
      }

      // Caso equipo lleno
      else if (isSuccess && team.length >= teamLimit) {
        Swal.fire({
          title: `Tu equipo está lleno. No puedes atrapar más Pokémon.`,
          icon: "warning",
          customClass: {
            popup: 'alert'
          }
        });
        showMessage('');
      }

      // Caso pokemon se escape
      else {
        Swal.fire({
          title: `¡Oh no! ${pokemonName} se ha escapado.`,
          icon: "error",
          customClass: {
            popup: 'alert'
          }
        });
        showMessage('');
      }

      pokeballsLeft--;
      updatePokeballsLeftText();

      // Caso sin pokeballs    
      if (pokeballsLeft === 0) {
        Swal.fire({
          title: `Te has quedado sin pokeballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice} creditos cada una.`,
          icon: "warning",
          customClass: {
            popup: 'alert'
          }
        });
        showMessage('');
      }

      saveTeamAndPokeballs(); // Guardar el equipo y las Pokébolas restantes en el localStorage
      displayTeamMembers();
    }

    // Caso sin pokeballs
    else {
      Swal.fire({
        title: `Te has quedado sin pokeballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice} creditos cada una.`,
        icon: "warning",
        customClass: {
          popup: 'alert'
        }
      });
      showMessage('');
    }
  }

  // Funcion para actualizar pokeballs
  function updatePokeballsLeftText() {
    pokeballsLeftText.textContent = `Pokeballs restantes: ${pokeballsLeft}`;
  }

  // Funcion convertir primer letra en mayuscula
  function convertLetter(palabra) {
    const string = palabra;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Funcion para obtener pokemon y hacer un array
  async function getPokemonInfo(numero) {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`);
    const data = await resp.json();

    const pokemonName = convertLetter(data.name);
    const pokemonType = data.types.map(typeData => typeData.type.name);
    const pokemonSprite = data.sprites.front_default;
    return { name: pokemonName, type: pokemonType, sprite: pokemonSprite };
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
