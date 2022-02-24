<script setup>
defineProps({
	pokemons: Array,
	search: Boolean,
	total: Number,
	firstPage: Boolean,
	lastPage: Boolean,
	detailledInfo: Array,
});
</script>

<template>
	<div class="pokedex">
		<div id="pokelist" class="col23">
			<div class="row" v-if="!search">
				<label for="nbMax">Nombre max à afficher</label>
				<select id="nbMax" @change="updateLimit()" v-model="limit">
					<option value="25" selected>25</option>
					<option value="50">50</option>
					<option value="75">75</option>
					<option value="100">100</option>
					<option value="125">125</option>
				</select>
			</div>
			<div class="row" id="pages" v-if="!search">
				<div
					class="page"
					v-for="page in parseInt(total / limit)"
					:key="page"
					@click="getPage(page)"
				>
					{{ page }}
				</div>
			</div>
			<div class="tiles" v-for="pokemon of pokemons" ref="pokemon.id">
				<img
					:src="pokemon.img"
					:alt="pokemon.name + ' picture'"
					@click="showPokemon(pokemon.id)"
				/>
				<p name="id">#{{ pokemon.id }}</p>
				<p name="name">{{ capitalize(pokemon.name) }}</p>
				<p name="types">
					<span v-for="slot in pokemon.types" :key="slot" class="type">{{
						capitalize(slot.type.name)
					}}</span>
				</p>
			</div>
			<div class="row">
				<div class="pageNav" @click="firstPoke">First</div>
				<div class="pageNav" :disabled="firstPage" @click="previousPoke">
					Prev
				</div>
				<div class="pageNav" :disabled="lastPage" @click="nextPoke">Next</div>
				<div class="pageNav" @click="lastPoke">Last</div>
			</div>
		</div>
		<div class="col13">
			<div id="pokemonInfos" v-for="info in detailledInfo" :key="info.id">
				<p>
					<img :src="info.img" :alt="info.name + ' picture'" />
				</p>
				<p>#{{ info.id }}</p>
				<p>{{ capitalize(info.name) }}</p>
				<p>
					<span v-for="slot in info.types" :key="slot" class="type">{{
						capitalize(slot.type.name)
					}}</span>
				</p>
				<p>
					<span
						v-for="ability in info.abilities"
						:key="ability.ability.name"
						class="ability"
						>{{ capitalize(ability.ability.name) }}</span
					>
				</p>
				<p>{{ info.weight }}kg</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			limit: 25,
		};
	},
	methods: {
		capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		nextPoke() {
			this.$emit("next");
		},
		previousPoke() {
			this.$emit("previous");
		},
		firstPoke() {
			this.$emit("first");
		},
		lastPoke() {
			this.$emit("last");
		},
		updateLimit() {
			this.$emit("limit", this.limit);
		},
		getPage(n) {
			this.$emit("changePage", n);
		},
		showPokemon(id) {
			this.$emit("showPokemon", id);
		},
	},
};
</script>

<style scoped>
#pokelist {
	background-color: #eee;
	padding: 0px 20px;
	flex: 1 1 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
}
.tiles {
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
	background-color: lightgray;
	margin: 20px 15px;
	min-width: 200px;
	max-width: 25%;
	flex: 1 1 0;
}

img {
	max-width: 80%;
}

span {
	border: 1px dotted black;
	border-radius: 25px;
	margin-bottom: 10px;
	margin-right: 5px;
	padding: 5px;
}
.type {
	background-color: lightgreen;
}

.ability {
	background-color: lightcoral;
}

select {
	margin-left: 10px;
}
.pageNav {
	background-color: lightgreen;
	border: 1px dashed black;
	border-radius: 25px;
	margin: 10px 10px;
	width: 100px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.row {
	margin-top: 10px;
	width: 100%;
	flex-grow: 1;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: center;
}

.page {
	background-color: lightblue;
	border-radius: 5px;
	margin: 5px 5px;
	padding: 3px;
}

#pages {
	padding: 0px 50px;
}

.col23,
.col13 {
	flex: 1 1 0;
	display: flex;
	align-content: space-around;
	justify-content: space-around;
}
.col23 {
	max-width: 75%;
	border-right: 2px dashed black;
}
.col13 {
	max-width: 20%;
}

#pokemonInfos {
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
	background-color: lightblue;
	height: fit-content;
	position: sticky;
	width: 250px;
	top: 30%;
	right: 0;
}

#pokemonInfos p {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-content: space-around;
}
</style>
