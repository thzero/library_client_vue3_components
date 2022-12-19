<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

import base from './base';

export default {
	name: 'BaseOpenSource',
	extends: base,
	setup(props) {
		const data = ref('800px');
		const dependenciesClient = ref( []);
		const dependenciesServer = ref( []);

		const initializeDependenciesClient = async () => {
			return [];
		};
		const initializeDependenciesServer = async () => {
			return [];
		};

		// const dependenciesClient = computed(() => {
		// 	return dependencies.value ? dependencies.value.filter(l => l.category === 'client').dependencies : [];
		// });
		// const dependenciesServer = computed(() => {
		// 	return dependencies.value ? dependencies.value.filter(l => l.category === 'server').dependencies : [];
		// });
		const key = (index, prefix, secondary) => {
				return prefix + '' + index + '' + secondary;
		};
		
		const instance = getCurrentInstance();

		onMounted(async () => {
			dependenciesClient.value = await instance.ctx.initializeDependenciesClient();
			dependenciesServer.value = await instance.ctx.initializeDependenciesServer();
		});

		return Object.assign(base.setup(props), {
			data,
			dependenciesClient,
			dependenciesServer,
			initializeDependenciesClient,
			initializeDependenciesServer,
			key
		});
	},
	// data: () => ({
	// 	height: '800px',
	// 	dependencies: [ {
	// 			category: 'client',
	// 			dependencies: [ ]
	// 		},
	// 		{
	// 			category: 'server',
	// 			dependencies: [ ]
	// 		}
	// 	]
	// }),
	// computed: {
	// 	dependenciesClient() {
	// 		return this.initializeDependenciesClient();
	// 	},
	// 	dependenciesServer() {
	// 		return this.initializeDependenciesServer();
	// 	}
	// },
	// created() {
	// 	let dependencies = this.dependencies.find(l => l.category === 'client');
	// 	dependencies.dependencies = this.initializeDependenciesClient();
	// 	dependencies = this.dependencies.find(l => l.category === 'server');
	// 	dependencies.dependencies = this.initializeDependenciesServer();
	// },
	// mounted() {
	// 	// this.onResize();
	// },
	// methods: {
	// 	initializeDependenciesClient() {
	// 		return [];
	// 	},
	// 	initializeDependenciesServer() {
	// 		return [];
	// 	},
	// 	key(index, prefix, secondary) {
	// 		return prefix + '' + index + '' + secondary;
	// 	}// ,
	// 	// onResize() {
	// 	// 	let temp = window.innerHeight - 200;
	// 	// 	if (temp < 200)
	// 	// 		temp = 200;
	// 	// 	this.height = temp;
	// 	// }
	// }
};
</script>

<style scoped>
	.opensource-padding {
		padding-left: 16px
	}
</style>
