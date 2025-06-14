const elementList = document.querySelector("#cards-container");
const searchBar = document.querySelector("#search-bar");
let pokemonesUnicos = [];

// ✅ URL corregida: Ahora obtiene el JSON desde tu nuevo repositorio en GitHub
async function fetchData() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/FranBanda/pokemons.json-/main/pokemons.json"); // 🔥 Nueva URL
        if (!response.ok) throw new Error(`Error al obtener los datos: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return null;
    }
}

// 🔥 Función para eliminar duplicados en la lista de Pokémon
function eliminarRepetidos(pokemones) {
    return [...new Map(pokemones.map(poke => [poke.name, poke])).values()];
}

// 🔥 Crear la estructura de la tarjeta de Pokémon
function crearCard(pokemon) {
    return `
        <div class="card">
            <img class="card-img-top" src="${pokemon.ThumbnailImage}" alt="${pokemon.name}">
            <div class="card-body hidden"> <!-- Oculto con CSS -->
                <h5 class="card-title">${pokemon.name}</h5>
                <p class="card-text">Peso: ${pokemon.weight}</p>
                <p class="card-text">Altura: ${pokemon.height}</p>
                <p class="card-text">Debilidad: ${pokemon.weakness}</p>
                <p class="card-text">Tipo: ${pokemon.type.join(" - ")}</p>
            </div>
            <button class="btn-poke view-details">${pokemon.name}</button>
        </div>`;
}

// 🔥 Genera las tarjetas en el contenedor
function listarApi(arreglo) {
    elementList.innerHTML = arreglo.map(crearCard).join('');
}

// 🔥 Alternar visibilidad de los detalles sin Bootstrap
elementList.addEventListener("click", event => {
    if (event.target.classList.contains("view-details")) {
        const card = event.target.closest('.card');
        const details = card.querySelector('.card-body');
        
        details.classList.toggle("hidden"); // Alternamos la clase en lugar de modificar `display`
    }
});

// 🔥 Aplicación de debounce en la barra de búsqueda para eficiencia
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// 🔥 Filtrar Pokémon mientras el usuario escribe en el buscador
searchBar.addEventListener("input", debounce(() => {
    const texto = searchBar.value.toLowerCase();
    listarApi(pokemonesUnicos.filter(poke => poke.name.toLowerCase().includes(texto)));
}, 300));

// 🚀 Llamada a la API y carga de datos
async function llamada_Api() {
    const datosApi = await fetchData();
    if (!datosApi || datosApi.length === 0) {
        console.error("Los datos no se cargaron correctamente.");
        return;
    }
    pokemonesUnicos = eliminarRepetidos(datosApi);
    listarApi(pokemonesUnicos);
}

llamada_Api();