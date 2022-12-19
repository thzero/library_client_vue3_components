<script>
import { getCurrentInstance, onMounted } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from './base';

export default {
	name: 'BaseApp',
	extends: base,
	setup(props) {
		const instance = getCurrentInstance();

		GlobalUtility.$EventBus.on('auth-refresh', async (user) => {
			const correlationId = instance.ctx.correlationId();
			instance.ctx.logger.debug('BaseApp', 'created', 'auth-refresh', user, correlationId);
			const items = await instance.ctx.initialize(correlationId);
			if (!items)
				return;
			await Promise.all(items);
		});

		onMounted(async () => {
			(async () => {
				const correlationId = instance.ctx.correlationId();
				const items = await instance.ctx.initialize(correlationId);
				if (!items)
					return;
				await Promise.all(items);
			})().catch(err => {
				// eslint-disable-next-line
				console.error(err);
			});
		});

		return Object.assign(base.setup(props), {
		});
	},
	// async created() { // TODO: to setup() https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8
	// 	GlobalUtility.$EventBus.on('auth-refresh', async (user) => {
	// 		const correlationId = this.correlationId();
	// 		this.logger.debug('BaseApp', 'created', 'auth-refresh', user, correlationId);
	// 		const items = await this.initialize(correlationId);
	// 		if (!items)
	// 			return;
	// 		await Promise.all(items);
	// 	});
	// },
	// async mounted() {
	// 	(async () => {
	// 		const correlationId = this.correlationId();
	// 		const items = await this.initialize(correlationId);
	// 		if (!items)
	// 			return;
	// 		await Promise.all(items);
	// 	})().catch(err => {
	// 		// eslint-disable-next-line
	// 		console.error(err);
	// 	});
	// },
	// methods: {
	// 	async initialize() {
	// 		return super.initialize();
	// 	}
	// }
};
</script>
