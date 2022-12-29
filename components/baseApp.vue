<script>
import { onMounted } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

// import base from './base';
import { useBaseComponent } from './base';

export function useBaseAppComponent(props, context, initializeI) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	} = useBaseComponent(props, context, initializeI);

	GlobalUtility.$EventBus.on('auth-refresh', async (user) => {
		const correlationIdI = correlationId();
		logger.debug('useBaseAppComponent', 'created', 'auth-refresh', user, correlationIdI);
		// const items = await initialize(correlationIdI);
		// if (!items)
		// 	return;
		// await Promise.all(items);
	});

	onMounted(async () => {
		(async () => {
			const correlationIdI = correlationId();
			const items = await initialize(correlationIdI);
			if (!items)
				return;
			await Promise.all(items);
		})().catch(err => {
			// eslint-disable-next-line
			console.error(err);
		});
	});

	return {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	};
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
