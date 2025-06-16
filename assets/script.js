const elementList = document.querySelector("#cards-container");
const searchBar = document.querySelector("#search-bar");
let pokemonesUnicos = [];

async function fetchData() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/FranBanda/pokemons.json-/main/pokemons.json"); 
        if (!response.ok) throw new Error(`Error al obtener los datos: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return null;
    }
}

function eliminarRepetidos(pokemones) {
    return [...new Map(pokemones.map(poke => [poke.name, poke])).values()];
}

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

function listarApi(arreglo) {
    elementList.innerHTML = arreglo.map(crearCard).join('');
}

elementList.addEventListener("click", event => {
    if (event.target.classList.contains("view-details")) {
        const card = event.target.closest('.card');
        const details = card.querySelector('.card-body');
        
        details.classList.toggle("hidden"); 
    }
});

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

searchBar.addEventListener("input", debounce(() => {
    const texto = searchBar.value.toLowerCase();
    listarApi(pokemonesUnicos.filter(poke => poke.name.toLowerCase().includes(texto)));
}, 300));

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