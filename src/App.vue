<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Search from "./components/Search.vue";
import Pokedex from "./components/Pokedex.vue";
</script>

<template>
	<div id="title">
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
		:firstPage="offset - limit <= 0"
		:lastPage="offset + limit >= total"
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
		addPoke(name) {
			P.getPokemonByName(name).then((pokemon) => {
				let svg = pokemon.sprites.other.dream_world.front_default;
				let src =
					svg != null
						? svg
						: pokemon.sprites.other["official-artwork"].front_default;
				this.pokemons.push({
					name: pokemon.name,
					id: pokemon.id,
					types: pokemon.types,
					img: src,
				});
			});
		},
		searchPoke(search) {
			this.offset = 0;
			this.pokemons = [];

			if (search.id > "") {
				this.addPoke(search.id);
			} else {
				if (search.name > "") {
					for (const pokemon of this.pokemonList) {
						if (pokemon.name.includes(search.name)) {
							this.addPoke(pokemon.name);
						}
					}
				} else {
					this.offset = 0;
					this.getNextPokes();
				}
			}
			if (search.id <= "" && search.name <= "") this.search = false;
			else this.search = true;
		},
		async getNextPokes(offset = this.offset, prev = false) {
			if (this.pokemonList.length == 0) {
				await P.getPokemonsList().then((response) => {
					this.pokemonList = response.results;
					this.total = response.count;
				});
			}

			if (prev) offset -= 2 * this.limit;

			this.pokemons = [];
			let bound = Math.min(offset + this.limit, this.pokemonList.length);
			for (let i = offset; i < bound; i++) {
				P.getPokemonByName(this.pokemonList[i].name).then((pokemon) => {
					let svg = pokemon.sprites.other.dream_world.front_default;
					let png = pokemon.sprites.other["official-artwork"].front_default;
					let png_2 = pokemon.sprites.front_default;
					let src = svg != null ? svg : png != null ? png : png_2;
					this.pokemons.push({
						name: pokemon.name,
						id: pokemon.id,
						types: pokemon.types,
						img: src,
					});
				});
			}
			this.offset = offset + this.limit;
		},
		async getDetailledInfo(id) {
			await P.getPokemonByName(id).then((pokemon) => {
				let svg = pokemon.sprites.other.dream_world.front_default;
				let png = pokemon.sprites.other["official-artwork"].front_default;
				let png_2 = pokemon.sprites.front_default;
				let src = svg != null ? svg : png != null ? png : png_2;
				this.infos = [
					{
						name: pokemon.name,
						id: pokemon.id,
						img: src,
						types: pokemon.types,
						abilities: pokemon.abilities,
						weight: pokemon.weight,
					},
				];
			});
		},
		updateLimit(limit) {
			this.offset -= this.limit;
			this.limit = limit;
			this.getNextPokes();
		},
		changePage(n) {
			this.offset = this.limit * (n - 1);
			this.getNextPokes();
		},
	},
};
</script>
