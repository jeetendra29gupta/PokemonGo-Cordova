const endpointUrl = 'https://beta.pokeapi.co/graphql/v1beta';
const limit = 20;
let offset = 0;
let allPokemonData = [];

window.onload = function () {
    fetchPokemonData(20, 0)
};

document.getElementById('left_arrow').onclick = function () {
    changePage(-1)
};

document.getElementById('right_arrow').onclick = function () {
    changePage(1)
};

function changePage(direction) {
    offset += direction * limit;
    if (offset < 0) offset = 0;
    fetchPokemonData(limit, offset);
};

function fetchPokemonData(limit, offset) {
    const query = `{
        pokemon_v2_pokemon(limit: ${limit}, offset: ${offset}) {
          id
          name
          height
          base_experience
          order
          pokemon_v2_pokemonsprites {
            sprites(path: "front_default")
          }
        }
      }`;

    const requestBody = {
        query: query,
    };

    fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const pokemonData = data.data.pokemon_v2_pokemon;
            allPokemonData = pokemonData;

            const container = document.getElementById('pokemon-go-data');
            container.innerHTML = '';

            pokemonData.forEach(pokemon => {
                const pokemonDiv = document.createElement('div');
                pokemonDiv.classList.add('w3-col', 's6', 'w3-center');
                const imgSrc = pokemon.pokemon_v2_pokemonsprites[0]?.sprites || 'images/pokemon.png';

                pokemonDiv.innerHTML = `
              <img src="${imgSrc}" alt="${pokemon.name}" class="w3-image w3-section"0>
              <div class="w3-container">
                <h4><b>${pokemon.name.toUpperCase()}</b></h4>
                <p>Height: ${pokemon.height}</p>
                <p>Experience: ${pokemon.base_experience}</p>
                <p>Order: ${pokemon.order}</p>
              </div>
            `;

                container.appendChild(pokemonDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert(`Error fetching data: ${error}`);
        });

};

document.getElementById('searchInput').onkeyup = function (event) {
    const input = event.target.value;
    const filter = input.toUpperCase();
    const container = document.getElementById('pokemon-go-data');
    container.innerHTML = '';

    allPokemonData.forEach(pokemon => {
        if (pokemon.name.toUpperCase().indexOf(filter) > -1) {
            const pokemonDiv = document.createElement('div');
            pokemonDiv.classList.add('w3-col', 's6', 'w3-center');
            const imgSrc = pokemon.pokemon_v2_pokemonsprites[0]?.sprites || 'images/pokemon.png';

            pokemonDiv.innerHTML = `
            <img src="${imgSrc}" alt="${pokemon.name}" class="w3-image w3-section">
            <div class="w3-container">
              <h4><b>${pokemon.name.toUpperCase()}</b></h4>
              <p>Height: ${pokemon.height}</p>
              <p>Experience: ${pokemon.base_experience}</p>
              <p>Order: ${pokemon.order}</p>
            </div>
          `;

            container.appendChild(pokemonDiv);
        }
    });
};
