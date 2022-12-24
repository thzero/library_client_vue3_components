<script>
import { getCurrentInstance, onMounted, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from './base';

export default {
	name: 'BaseOpenSource',
	extends: base,
	setup(props) {
		const instance = getCurrentInstance();

		const serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);

		const data = ref('800px');
		const dependenciesClient = ref([]);
		const dependenciesServer = ref([]);

		const initializeDependenciesClient = async () => {
			return [];
		};
		const initializeDependenciesClientBase = async () => {
			const temp = await import('open-source-config');
			const openSournce = temp.default();
			let output = [];
			let items;
			for (const source of openSournce) {
				items = source();
				output = combineDependencies(output, items, 'client');
			}
			return output;
		};
		const initializeDependenciesServerBase = async () => {
			return [
			];
		};

		const key = (index, prefix, secondary) => {
				return prefix + '' + index + '' + secondary;
		};

		const combineDependencies = (target, source, category) => {
			let output = target !== null && Array.isArray(target) ? target : [];
			
			if (source && Array.isArray(source)) {
				source.forEach(element => {
					if (element.category !== category)
						return;
					if (output.filter(l => l.name === element.name).length > 0)
						return;
					output.push(element);
				});
			}

			output = output.sort((a, b) => a.name.localeCompare(b.name));
			return output;
		};

		onMounted(async () => {
			dependenciesClient.value = combineDependencies(
				await instance.ctx.initializeDependenciesClient(), 
				await instance.ctx.initializeDependenciesClientBase(), 'client');
			const response = await instance.ctx.serviceStore.dispatcher.requestOpenSource();
			if (instance.ctx.hasFailed(response))
				return;
			dependenciesServer.value = response.results;
		});

		return Object.assign(base.setup(props), {
			combineDependencies,
			data,
			dependenciesClient,
			dependenciesServer,
			initializeDependenciesClient,
			initializeDependenciesClientBase,
			key,
			serviceStore
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
