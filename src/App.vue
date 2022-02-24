<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Search from "./components/Search.vue";
import Pokedex from "./components/Pokedex.vue";
</script>

<template>
	<div id="title">
		<h1>Pokedex</h1>
		<h2><i>Pika pika</i></h2>
		<img
			src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"
			alt="Pikachu"
		/>
	</div>
	<Search @search-poke="searchPoke" />
	<Pokedex
		id="pokelist"
		:pokemons="pokemons"
		:total="total"
		:search="search"
		:detailledInfo="infos"
		@next="getNextPokes()"
		@previous="getNextPokes(this.offset, true)"
		@first="getNextPokes(0)"
		@last="getNextPokes(this.total - this.limit + 1)"
		@limit="updateLimit"
		@changePage="changePage"
		@showPokemon="getDetailledInfo"
	/>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
#title h1 {
	font-size: 64pt;
}
</style>

<script>
export default {
	data() {
		return {
			pokemons: [],
			pokemonList: [],
			offset: 0,
			limit: 25,
			total: 0,
			search: false,
			infos: [],
		};
	},
	mounted() {
		this.getNextPokes();
	},
	methods: {
		//Retrieve the required information about a pokemon
		addPoke(name) {
			P.getPokemonByName(name).then((pokemon) => {
				this.pokemons.push({
					name: pokemon.name,
					id: pokemon.id,
					types: pokemon.types,
					img: this.getImg(pokemon),
				});
			});
		},
		//Retrieve the image of a pokemon
		getImg(pokemon) {
			const svg = pokemon.sprites.other.dream_world.front_default;
			const png = pokemon.sprites.other["official-artwork"].front_default;
			const png_2 = pokemon.sprites.front_default;
			const finalPng = png != null ? png : png_2;
			return svg != null ? svg : finalPng;
		},
		//Search a pokemon with a name or an id. If both are empty, then returns the full list
		searchPoke(search) {
			this.offset = 0;
			this.pokemons = [];

			if (search.id > "") {
				this.addPoke(search.id);
			} else {
				if (search.name > "") {
					this.pokemonList.forEach((pokemon) => {
						if (pokemon.name.includes(search.name))
							//Add to display only pokemon whose name contains the wanted string
							this.addPoke(pokemon.name);
					});
				} else {
					this.offset = 0;
					this.getNextPokes();
				}
			}
			if (search.id <= "" && search.name <= "") this.search = false;
			else this.search = true; //To mask some unnecessary elements
		},
		//Retrieve the this.limit next pokemons information and
		async getNextPokes(offset = this.offset, prev = false) {
			if (this.pokemonList.length == 0) {
				//For the first run
				await P.getPokemonsList().then((response) => {
					this.pokemonList = response.results;
					this.total = response.count;
				});
			}

			if (prev) offset -= 2 * this.limit; //If we're going backward we have to substract twice 'this.limit' because the offset is at the beginning of the next set of pokemon. If we substract it once, we'll get the same display

			this.pokemons = []; //Clear display
			let bound = Math.min(offset + parseInt(this.limit), this.pokemonList.length);
			for (let i = offset; i < bound; i++) {
				P.getPokemonByName(this.pokemonList[i].name).then((pokemon) => {
					this.addPoke(pokemon.name);
				});
			}
			this.offset = offset + this.limit;
		},
		//Retrieve detailled information to place in the 'zoom'
		getDetailledInfo(id) {
			P.getPokemonByName(id).then((pokemon) => {
				this.infos = [
					{
						name: pokemon.name,
						id: pokemon.id,
						img: this.getImg(pokemon),
						types: pokemon.types,
						abilities: pokemon.abilities,
						weight: pokemon.weight,
					},
				];
			});
		},
		updateLimit(limit) {
			this.offset -= this.limit; //We reset the offset at the beginning of the current set
			this.limit = limit; //We update the value of limit
			this.getNextPokes(); //And then update the display so we get the same pokemons with the other ones
		},
		changePage(n) {
			this.offset = this.limit * (n - 1); //Set the offset to match the beginning of page n
			this.getNextPokes(); //Update the display
		},
	},
};
</script>
