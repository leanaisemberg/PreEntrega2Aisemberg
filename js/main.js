//Preguntas para la función final

let gender = Number(prompt('¿Eres un chico, una chica o no te identificas con ninguno?\n1 Chico\n2 Chica\n3 No me siento identificado con ninguno'));
let nombre = prompt('¿Cuál es tu nombre?');
let comida = prompt('¿Cuál es tu comida favorita?');

//Número del pokemon del 1 al 9, dejando alertas también para los casos donde no completan con los valores requeridos

let promptpokemon = 0;
while (promptpokemon < 1 || promptpokemon > 9) {
  userInput = prompt('Elige tu pokemon utilizando su número, del 1 al 9');

  if (isNaN(userInput)) {
    alert('¡Ingresa un valor numérico!');
  } else {
    promptpokemon = parseInt(userInput);
    if (promptpokemon < 1 || promptpokemon > 9) {
      alert('¡Del 1 al 9 te dije!');
    }
  }
}
let nropokemon = parseInt(promptpokemon);

//Se le asigna el nombre al pokemon usando el número que ingresaron

let pokemonName;
switch (nropokemon) {
  case 1:
    pokemonName = 'Bulbasaur';
    break;
  case 2:
    pokemonName = 'Ivysaur';
    break;
  case 3:
    pokemonName = 'Venusaur';
    break;
  case 4:
    pokemonName = 'Charmander';
    break;
  case 5:
    pokemonName = 'Charmeleon';
    break;
  case 6:
    pokemonName = 'Charizard';
    break;
  case 7:
    pokemonName = 'Squirtle';
    break;
  case 8:
    pokemonName = 'Wartortle';
    break;
  case 9:
    pokemonName = 'Blastoise';
    break;
  default:
    pokemonName = 'Pikachu';
}

//Condicionales Easter Egg
if (nombre.length === 0) {
  nombre = 'Ash'
}

if (comida.length === 0) {
  comida = 'Paleta'
}

//Función donde se conjugan todos los datos para saludar al usuario y se le informa de su pokemon elegido

function saludarEntrenador() {
  if (gender === "1") {
    alert('¡Hola, entrenador ' + nombre + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonName + '.');
  } else if (gender === "2") {
    alert('¡Hola, entrenadora ' + nombre + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonName + '.');
  } else {
    alert('Te damos la bienvenida, ' + nombre + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonName + '.');
  }
}

saludarEntrenador();