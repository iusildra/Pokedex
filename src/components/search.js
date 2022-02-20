app.component("search", {
    mounted() {
        this.fetchTypes();
        this.fetchAbilities();
    },
    template:
        /*html*/
        `
		<fieldset>
			<legend>Recherche</legend>
			<form @submit.prevent="onSubmit">
				<div class="row">
					<div id="typeList" class="col2">
						<div v-for="name in Object.keys(types).sort(Intl.Collator('en-US').compare)" :key="name" class="oneType">
							<span class="typeName">{{name}}</span>
							<div class="circle-grey" @click="changeType(name)">T</div>
							<div class="circle-grey" @click="changeWeakness(name)">W</div>
						</div>
						<div>
						Number range
						<input id="nbRangeMin" type="number" min="0" v-model="searchedRange[0]"/>-<input id="nbRangeMax" type="number" min="0" v-model="searchedRange[1]" />
						</div>
					</div>
					<div class="col2">
						<strong>Ability</strong>
						<div class="row">
							<select id="abilityForm" v-model="searchedAbility">
								<option selected>All</option>
								<option v-for="name in Object.keys(abilities).sort(Intl.Collator('en-US').compare)" :key="name">{{name}}</option>
							</select>
						</div>
						<strong>Heigth</strong>
						<div class="row">
							<div class="circle-caract" v-for="size in sizes" @click="changeHeigth(size)">{{size}}</div>
						</div>
						<strong>Weight</strong>
						<div class="row">
							<div class="circle-caract" v-for="weight in weights" @click="changeWeight(weight)">{{weight}}</div>
						</div>
					</div>
				</div>
				<div class="row">
					<input type="submit" value="Submit"/>
				</div>
			</form>
		</fieldset>`,
    data() {
        return {
            types: {},
            abilities: {},
            weights: ["Light", "Medium", "Heavy"],
            sizes: ["Small", "Medium", "Tall"],
            searchedTypes: {},
            searchedWeaknesses: {},
            searchedAbility: "",
            searchedWeight: "",
            searchedHeigth: "",
            searchedRange: Array(2),
        };
    },
    methods: {
        fetchTypes() {
            fetch("https://pokeapi.co/api/v2/type")
                .then((response) => response.json())
                .then((data) => {
                    this.types = Array(20);
                    for (const type of data.results) {
                        this.types[type.name] = type.url;
                    }
                });
        },
        fetchAbilities() {
            fetch("https://pokeapi.co/api/v2/ability?limit=327")
                .then((response) => response.json())
                .then((data) => {
                    for (const ability of data.results) {
                        this.abilities[ability.name] = ability.url;
                    }
                });
        },
        changeType(type) {
            //Ajoute le type s'il n'existe pas déjà. Sinon l'enlève
            if (this.searchedAbility.hasOwnProperty(type)) {
                delete this.searchedAbility[type];
            } else {
                delete this.searchedWeaknesses[type];
                this.searchedTypes[type] = this.types[type];
            }
        },
        changeWeakness(type) {
            if (this.searchedWeaknesses.hasOwnProperty(type)) {
                delete this.searchedWeaknesses[type];
            } else {
                delete this.searchedTypes[type];
                this.searchedWeaknesses[type] = this.types[type];
            }
        },
        changeHeigth(value) {
            this.searchedHeigth = value;
        },
        changeWeight(value) {
            this.searchedWeight = value;
        },
        onSubmit() {
            const search = {
                types: this.searchedTypes,
                weaknesses: this.searchedWeaknesses,
                ability: this.abilities[this.searchedAbility],
                weight: this.searchedWeight,
                heigth: this.searchedHeigth,
                range: this.searchedRange,
            };
            console.log(search);
        },
    },
    StyleSheet: "./search.css",
});
