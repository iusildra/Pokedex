const app = Vue.createApp({
	data() {
		return {
			types: {},
			weaknesses: {},
			abilitiesList: {},
			height: '',
			weight: '',
		}
	},
	methods: {
		fetchAbilities() {
			fetch("https://pokeapi.co/api/v2/type").then(response => response.json()).then(data => this.abilitiesList = data)
		}
	},
})