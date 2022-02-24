<script setup>
defineProps({
	msg: String,
});
</script>

<template>
	<fieldset>
		<legend><h1>Recherche</h1></legend>
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
			types: [], //List of every type
			abilities: [], //List of every ability
			weights: ["Light", "Medium", "Heavy"],
			sizes: ["Small", "Medium", "Tall"],
			name: "",
			id: "",
			wtTypes: {}, //List of wanted types
			wtWeaknesses: {}, //...
			wtAbility: "", //..
			wtWeight: "", //..
			wtHeigth: "", //..
			wtRange: Array(2), //..
			circleColor: ["lightgrey", "blue"], //To change the color of a clicked circle
		};
	},
	methods: {
		//Retrieve the type list
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
		//Retrieve the ability list
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
		//Add or remove a type to the wanted type variable based on it's presence in the variable
		changeType(type) {
			if (this.wtTypes.hasOwnProperty(type)) {
				delete this.wtTypes[type];
			} else {
				delete this.wtWeaknesses[type];
				this.wtTypes[type] = type;
			}
		},
		//Add or remove a weakness to the wanted type variable based on it's presence in the variable
		changeWeakness(type) {
			if (this.wtWeaknesses.hasOwnProperty(type)) {
				delete this.wtWeaknesses[type];
			} else {
				delete this.wtTypes[type];
				this.wtWeaknesses[type] = type;
			}
		},
		//Apply changes
		changeHeigth(value) {
			this.wtHeigth = value;
		},
		//Apply changes
		changeWeight(value) {
			this.wtWeight = value;
		},
		//Validate the form and ask for searching
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
.col2 {
	flex: 1 1 0;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	align-content: space-between;
	justify-content: space-evenly;
}

fieldset {
	margin: 10px 0px;
	background-color: #84e9c3;
}
.row {
	width: 100%;
	margin-top: 20px;
	flex: 1 1 0;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-evenly;
}

#typeList {
	flex-direction: row;
}

.circle-grey,
.circle-caract {
	background-color: lightgrey;
	border: 1px solid black;
	border-radius: 50%;
	margin-left: 20px;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.circle-grey {
	width: 25px;
	height: 25px;
}

.circle-caract {
	width: 75px;
	height: 75px;
}

.oneType {
	box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
	background-color: lightgrey;
	border: 1px dotted black;
	border-radius: 25px;
	padding: 0px 10px;
	height: 50px;
	margin: 5px;
	justify-content: space-around;
	align-items: center;
	flex-wrap: nowrap;
	display: flex;
	flex: 1 1 0;
}

.typeName {
	min-width: 75px;
}

input,
select {
	margin-left: 5px;
	padding: 2px 10px;
	border-radius: 10px;
	height: fit-content;
}

#submitForm {
	display: inline-block;
}

#nbRangeMin,
#nbRangeMax,
#pokeId {
	width: 75px;
}

#nameId {
	padding-bottom: 10px;
	border-bottom: 2px solid black;
}
</style>
