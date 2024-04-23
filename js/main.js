// Informacion de los Pokemones iniciales
const pokemonInfo = [
    {id: 1, nombre: 'Bulbasaur', tipo: 'planta', generacion: 1 },
    {id: 2, nombre: 'Charmander', tipo: 'fuego', generacion: 1 },
    {id: 3, nombre: 'Squirtle', tipo: 'agua', generacion: 1 },
    {id: 4, nombre: 'Chikorita', tipo: 'planta', generacion: 2 },
    {id: 5, nombre: 'Cyndaquil', tipo: 'fuego', generacion: 2 },
    {id: 6, nombre: 'Totodile', tipo: 'agua', generacion: 2 },
    {id: 7, nombre: 'Treecko', tipo: 'planta', generacion: 3 },
    {id: 8, nombre: 'Torchic', tipo: 'fuego', generacion: 3 },
    {id: 9, nombre: 'Mudkip', tipo: 'agua', generacion: 3 },
    {id: 10, nombre: 'Pikachu', tipo: 'electrico', generacion: 1 }
]

// Funcion mostrar lista de pokemones
function obtenerPokemonLista (array) { 
    let lista = array.map ((elemento) => elemento.id + '. ' + elemento.nombre).join('\n') 
    alert("Esta es la lista de pokemones iniciales disponibles:\n" + lista)
}

// Funcion para obtener pokemon elegido
function obtenerPokemonNombre(array, objeto1, objeto2) {
    let nombreParcial = array.filter((elemento) => {
        return elemento.tipo === objeto1 && elemento.generacion === objeto2
    }) 

    if (nombreParcial.length === 0) {
        nombreParcial = array.find((elemento) => elemento.id === 10)
        alert('No has seleccionado ningún pokemon, así que te hemos asignado al pokemon ¡Pikachu!')
        return nombreParcial.nombre 
    } else {
        return nombreParcial[0].nombre 
    }   
}

function saludoEntrenador(array) {
    let genero = Number(prompt('¿Eres un chico, una chica o no te identificas con ninguno?\n1 Chico\n2 Chica\n3 No me siento identificado con ninguno'));
    let nombreEntrenador = prompt('¿Cuál es tu nombre?');
    let comida = prompt('¿Cuál es tu comida favorita?');

    obtenerPokemonLista (array)

    let pokemonTipo = prompt('Elegí tu tipo favorito. Los disponibles son:\n- Fuego\n- Agua\n- Planta').toLowerCase()
    let pokemonGen = Number(prompt('Elegí tu generación favorito (ingresa solo el número). Las disponibles son:\nGeneración 1\nGeneración 2\nGeneración 3'))

    let pokemonNombre = obtenerPokemonNombre (array, pokemonTipo, pokemonGen)

    //Condicionales Easter Egg
    if (nombreEntrenador.length === 0) {
        nombreEntrenador = 'Ash'
    }
        
    if (comida.length === 0) {
        comida = 'Paleta'
    }
    
    //Función donde se conjugan todos los datos para saludar al usuario y se le informa de su pokemon elegido
    if (genero === 1) {
      alert('¡Hola, entrenador ' + nombreEntrenador + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonNombre + '.');
    } else if (genero === 2) {
      alert('¡Hola, entrenadora ' + nombreEntrenador + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonNombre + '.');
    } else {
      alert('Te damos la bienvenida, ' + nombreEntrenador + ' de pueblo ' + comida + '!' + ' Has elegido a ' + pokemonNombre + '.');
    }
}

saludoEntrenador(pokemonInfo);







