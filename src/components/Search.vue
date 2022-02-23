<script setup>
defineProps({
	msg: String,
});
</script>

<template>
	<fieldset>
		<legend>Recherche</legend>
		<form @submit.prevent="onSubmit">
			<div class="row" id="nameId">
				<span>
					<label for="pokeName">Nom</label>
					<input type="text" id="pokeName" v-model.lazy="name" />
				</span>
				<span>
					<label for="pokeId">Id</label>
					<input type="number" id="pokeId" v-model.lazy="id" />
				</span>
				<span>
					<label for="nbRangeMin">ID min</label>
					<input
						id="nbRangeMin"
						type="number"
						min="0"
						v-model.lazy="wtRange[0]"
					/>
				</span>
				<span>
					<label for="nbRangeMax">ID max</label>
					<input
						id="nbRangeMax"
						type="number"
						min="0"
						v-model.lazy="wtRange[1]"
					/>
				</span>
			</div>
			<div class="row">
				<div id="typeList" class="col2">
					<div
						v-for="name of types.sort(Intl.Collator('en-US').compare)"
						:key="name"
						class="oneType"
					>
						<span class="typeName">{{ name }}</span>
						<div class="circle-grey" @click="changeType(name)">T</div>
						<div class="circle-grey" @click="changeWeakness(name)">W</div>
					</div>
				</div>
				<div class="col2">
					<strong>Ability</strong>
					<div class="row">
						<select id="abilityForm" v-model="wtAbility">
							<option selected>All</option>
							<option
								v-for="name of abilities.sort(
									Intl.Collator('en-US').compare
								)"
								:key="name"
							>
								{{ name }}
							</option>
						</select>
					</div>
					<strong>Heigth</strong>
					<div class="row">
						<div
							class="circle-caract"
							v-for="size in sizes"
							@click="changeHeigth(size)"
						>
							{{ size }}
						</div>
					</div>
					<strong>Weight</strong>
					<div class="row">
						<div
							class="circle-caract"
							v-for="weight in weights"
							@click="changeWeight(weight)"
						>
							{{ weight }}
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<input type="submit" value="Submit" />
			</div>
		</form>
	</fieldset>
</template>

<script>
export default {
	mounted() {
		this.fetchTypes();
		this.fetchAbilities();
	},
	data() {
		return {
			types: [],
			abilities: [],
			weights: ["Light", "Medium", "Heavy"],
			sizes: ["Small", "Medium", "Tall"],
			name: "",
			id: "",
			wtTypes: {},
			wtWeaknesses: {},
			wtAbility: "",
			wtWeight: "",
			wtHeigth: "",
			wtRange: Array(2),
			circleColor: ["lightgrey", "blue"],
		};
	},
	methods: {
		fetchTypes() {
			fetch("https://pokeapi.co/api/v2/type")
				.then((response) => response.json())
				.then((data) => {
					this.types = Array(data.results.length);
					let i = 0;
					for (const type of data.results) {
						this.types[i] = type.name;
						i++;
					}
				});
		},
		fetchAbilities() {
			fetch("https://pokeapi.co/api/v2/ability?limit=327")
				.then((response) => response.json())
				.then((data) => {
					this.abilities = Array(data.results.length);
					let i = 0;
					for (const ability of data.results) {
						this.abilities[i] = ability.name;
						i++;
					}
				});
		},
		changeType(type) {
			//Ajoute le type s'il n'existe pas déjà. Sinon l'enlève
			if (this.wtTypes.hasOwnProperty(type)) {
				delete this.wtTypes[type];
			} else {
				delete this.wtWeaknesses[type];
				this.wtTypes[type] = type;
			}
		},
		changeWeakness(type) {
			//Ajoute le type s'il n'existe pas déjà. Sinon l'enlève
			if (this.wtWeaknesses.hasOwnProperty(type)) {
				delete this.wtWeaknesses[type];
			} else {
				delete this.wtTypes[type];
				this.wtWeaknesses[type] = type;
			}
		},
		changeHeigth(value) {
			this.wtHeigth = value;
		},
		changeWeight(value) {
			this.wtWeight = value;
		},
		onSubmit() {
			const search = {
				name: this.name,
				id: this.id,
				types: this.wtTypes,
				weaknesses: this.wtWeaknesses,
				ability: this.abilities[this.wtAbility],
				heigth: this.wtHeigth,
				weight: this.wtWeight,
				range: this.wtRange,
			};
			this.$emit("search-poke", search);
		},
	},
};
</script>

<style scoped>
.flex-container,
form,
.col2,
fieldset {
	display: flex;
	flex: 1 1 0;
	flex-wrap: wrap;
}

fieldset {
	margin: 10px 40px;
	background-color: #84e9c3;
}

.row {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-evenly;
	flex-grow: 1;
	margin-top: 20px;
	width: 100%;
}

#range {
	display: block;
}
.col2 {
	flex-direction: column;
	align-content: space-between;
	justify-content: space-evenly;
}

#typeList {
	flex-direction: row;
}

#pokelist {
	margin: 0px 5%;
	padding: 0px 5%;
	background-color: #eee;
	justify-content: space-evenly;
}

.tiles {
	margin: 20px 15px;
	background-color: lightgray;
	max-width: 25%;
	min-width: 150px;
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

img {
	width: 100%;
}

#title {
	background-color: yellow;
	text-align: center;
}

.circle-grey {
	width: 25px;
	height: 25px;
	margin-left: 20px;
	border-radius: 50%;
	background-color: lightgrey;
	border: 1px solid black;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.circle-caract {
	width: 75px;
	height: 75px;
	margin-left: 20px;
	border-radius: 50%;
	border: 1px solid black;
	background-color: lightgrey;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.oneType {
	display: flex;
	flex: 1 1 0;
	justify-content: space-around;
	align-items: center;
	flex-wrap: nowrap;
	background-color: lightgrey;
	border-radius: 25px;
	border: 1px dotted black;
	margin: 5px;
	height: 50px;
	padding: 0px 10px;
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.typeName {
	min-width: 75px;
}

input,
select {
	margin-left: 5px;
	padding: 5px;
	height: fit-content;
}

#submitForm {
	display: inline-block;
}

#nbRangeMin,
#nbRangeMax {
	width: 50px;
}

#nameId {
	padding-bottom: 10px;
	border-bottom: 2px solid black;
}
</style>
