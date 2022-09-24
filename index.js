const url = "https://pokeapi.co/api/v2/";
const main = document.querySelector("main");
const search = document.querySelector("#search");

const getFirstGen = async (limit, offset) => {
  try {
    // console.log("Limit:" + limit + " offset: " + offset)
    const response = await fetch(
      `${url}pokemon/?limit=${limit}&offset=${offset}"`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error.message);
  }
};
//getFirstGen().then((data) => console.log(data));

// const getPokemonById = async (id) => {
//   try {
//     const response = await fetch(`${url}pokemon/${id}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
//getPokemonById(1).then(data => console.log(data))

const getPokemon = async (pokemon) => {
  const response = await fetch(pokemon.url);
  return await response.json();
};

// getFirstGen().then((pokemons) =>
//   pokemons.forEach((pokemon) => {
//     getPokemon(pokemon.url).then((data) => console.log(data));
//   })
// );

const renderPokemonCard = (pokemonData) => {
  let types = "";

  pokemonData.types.forEach((pokemon) => {
    types += `<span class="${pokemon.type.name}">${pokemon.type.name}</span>`;
  });

  const template = `<div class="card" id="${pokemonData.id}">
  <div class="img-container">
  <img
  src="${pokemonData.sprites.other["official-artwork"].front_default}"
  alt=""
  />
  </div>
  
  <div class="content">
  <h3>${pokemonData.id} - ${pokemonData.name}</h3>
  </br>
  <div class="types">${types} </div>
  </div>
  </div>`;
    main.innerHTML += template;
  };

// getFirstGen().then((pokemons) =>
//   pokemons.forEach((pokemon) => {
//     getPokemon(pokemon).then((data) => {
//       renderPokemonCard(data);
//     });
//   })
// );

let currentPage = 1;
let limit = 12;
let offset = 0;

let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;

  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const addCards = () => {
  if (offset < 152) {
    getFirstGen(limit, offset).then((pokemons) =>
      pokemons.forEach((pokemon) => {
        getPokemon(pokemon).then((data) => {
          renderPokemonCard(data);
        });
      })
    );
    limit += 12;
    offset += 13;
  }
};

const handleInfiniteScroll = () => {
  throttle(() => {
    const endOfPage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if (endOfPage) {
      addCards();
    }
  }, 1000);
};

window.onload = function () {
  addCards(currentPage);
};

window.addEventListener("scroll", handleInfiniteScroll);

// Search
search.addEventListener("keyup", (e) => {
  main.childNodes.forEach((e) => {
    if (e.className === "card")
      e.childNodes.forEach((e) => {
        if (e.className === "content")
          e.childNodes.forEach((e) => {
            if (e.tagName === "H3") {
              //console.log(e.innerText);
              if (
                !e.innerText
                  .toLocaleLowerCase("tr-TR")
                  .includes(search.value.toLocaleLowerCase("tr-TR"))
              ) {
                e.parentNode.parentNode.style.display = "none";
              } else e.parentNode.parentNode.style.display = "flex";
            }
          });
      });
  });
});

document.querySelector("main").addEventListener("click", (e) => {
  console.log(main.childNodes);
  main.childNodes.forEach((card) => {});
});

document.querySelector(".material-symbols-outlined")
  .addEventListener("click", (e) => {
    document.querySelector("header").classList.toggle("toggle-menu");
  });