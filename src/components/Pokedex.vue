<script setup>
defineProps({
	pokemons: Object,
});
</script>

<template>
	<div id="pokelist">
		<div class="row">
			<label for="nbMax">Nombre max à afficher</label>
			<select id="nbMax" v-model="this.limit">
				<option value="25" selected>25</option>
				<option value="50">50</option>
				<option value="75">75</option>
				<option value="100">100</option>
				<option value="125">125</option>
			</select>
		</div>
		<div class="row">
			<div class="page">
				{{ this.firstPage }}
			</div>
		</div>
		<div class="tiles" v-for="pokemon of pokemons" ref="pokemon.id">
			<img :src="pokemon.img" alt="{{pokemon.name}}'s picture" />
			<p name="id">#{{ pokemon.id }}</p>
			<p>{{ capitalize(pokemon.name) }}</p>
			<p>
				<span v-for="slot in pokemon.types">{{
					capitalize(slot.type.name)
				}}</span>
			</p>
		</div>
		<div class="row">
			<div class="pageNav" @click="firstPoke">First</div>
			<div class="pageNav" :disabled="firstPage" @click="previousPoke">Prev</div>
			<div class="pageNav" :disabled="lastPage" @click="nextPoke">Next</div>
			<div class="pageNav" @click="lastPoke">Last</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		pokemons: Array,
		total: BigInt,
		firstPage: Boolean,
		lastPage: Boolean,
	},
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
	},
};
</script>

<style scoped>
#pokelist {
	display: flex;
	flex-wrap: wrap;
	flex: 1 1 0;
	margin: 0px 5%;
	padding: 0px 5%;
	background-color: #eee;
	justify-content: space-evenly;
}
.tiles {
	margin: 20px 15px;
	background-color: lightgray;
	max-width: 25%;
	min-width: 200px;
	flex: 1 1 0;
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

img {
	max-width: 80%;
}

span {
	background-color: lightgreen;
	border: 1px dotted black;
	border-radius: 25px;
	padding: 5px;
	margin-right: 5px;
}

select {
	margin: 0px 5px;
}
.pageNav {
	width: 100px;
	height: 50px;
	border: 1px dashed black;
	border-radius: 25px;
	background-color: lightgreen;
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: 10px 10px;
}

.row {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: center;
	flex-grow: 1;
	margin-top: 10px;
}

.page {
	background-color: lightblue;
}
</style>
