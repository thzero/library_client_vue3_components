<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import Response from '@thzero/library_common/response';

import base from '@/library_vue/components/base';

export default {
	name: 'VtBaseSettings',
	extends: base,
	setup(props) {
		const instance = getCurrentInstance();
		
		const serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);
		const serviceUsers = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);

		const fab = ref(false);
		const requestReset = ref(0);
		const snackbar = ref(false);
		const timeout = ref(2000);

		const hasPicture = computed(() => {
			return (instance.ctx.serviceStore.user != null && instance.ctx.serviceStore.user.external != null && !String.isNullOrEmpty(instance.ctx.serviceStore.user.external.picture));
		});
		const name = computed(() => {
			return (instance.ctx.serviceStore.user != null && instance.ctx.serviceStore.user.external != null && !String.isNullOrEmpty(instance.ctx.serviceStore.user.external.name) ? instance.ctx.serviceStore.user.external.name : '');
		});
		const picture = computed(() => {
			return (instance.ctx.serviceStore.user != null && instance.ctx.serviceStore.user.external != null && !String.isNullOrEmpty(instance.ctx.serviceStore.user.external.picture) ? instance.ctx.serviceStore.user.external.picture : '');
		});
		const user = computed(() => {
			return instance.ctx.serviceStore.user;
		});
		
		const cancel = async () => {
			await instance.ctx.reset(instance.ctx.correlationId());
		};
		const close = async () => {
		};
		const ok = async () => {
			instance.ctx.snackbar = true;
			return true;
		};
		const open = async () => {
			instance.ctx.fieldType = null;
			instance.ctx.name = '';
		};
		const preComplete = async (correlationId) => {
			const responses = [];

			await instance.ctx.preCompleteI(correlationId, responses);

			const response = Response.success(correlationId);
			for (const item of responses)
				response.success &= item.success;
			return response;
		};
		// eslint-disable-next-line
		const preCompleteI = async (correlationId, value) =>  {
		};
		const reset = (correlationId) => {
			const self = instance.ctx;
			setTimeout(() => {
				instance.ctx.$refs.form.reset(correlationId);
			},
			150);
		};
		// eslint-disable-next-line

		onMounted(async () => {
			await instance.ctx.reset(instance.ctx.correlationId(), null);
		});
		
		// (async () => {
		// 	// await instance.ctx.reset(instance.ctx.correlationId(), null);
		// 	await reset(correlationId(), null);
		// })();

		return Object.assign(base.setup(props), {
			cancel,
			close,
			fab,
			hasPicture,
			name,
			ok,
			open,
			picture,
			preComplete,
			preCompleteI,
			requestReset,
			reset,
			serviceStore,
			serviceUsers,
			snackbar,
			timeout,
			user
		});
	},
	// data: () => ({
	// 	fab: false,
	// 	requestReset: 0,
	// 	serviceUsers: null,
	// 	snackbar: false,
	// 	timeout: 2000
	// }),
	// computed: {
	// 	hasPicture() {
	// 		return (this.user != null && this.user.external.picture != null && this.user.external.picture !== '');
	// 	},
	// 	name() {
	// 		return (this.user != null && this.user.external.name != null ? this.user.external.name : '');
	// 	},
	// 	picture() {
	// 		return (this.user != null && this.user.external.picture != null ? this.user.external.picture : null);
	// 	},
	// 	user() {
	// 		return GlobalUtility.$store.state.user.user;
	// 	}
	// },
	// async created() {
	// 	await this.reset(this.correlationId(), null);
	// 	this.serviceUsers = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);
	// },
	// async mount() {
	// 	await this.reset(this.correlationId(), null);
	// },
	// methods: {
	// 	async cancel() {
	// 		await this.reset(this.correlationId());
	// 	},
	// 	async close() {
	// 	},
	// 	async ok() {
	// 		this.snackbar = true;
	// 		return true;
	// 	},
	// 	async open() {
	// 		this.fieldType = null;
	// 		this.name = '';
	// 	},
	// 	// eslint-disable-next-line
	// 	async preCompleteI(correlationId, value) {
	// 	},
	// 	async preComplete(correlationId) {
	// 		const responses = [];

	// 		await this.preCompleteI(correlationId, responses);

	// 		const response = Response.success(correlationId);
	// 		for (const item of responses)
	// 			response.success &= item.success;
	// 		return response;
	// 	},
	// 	reset(correlationId) {
	// 		const self = this;
	// 		setTimeout(() => {
	// 			self.resetI(correlationId);
	// 		},
	// 		150);
	// 	},
	// 	// eslint-disable-next-line
	// 	resetI(correlationId) {
	// 	}
	// }
};
</script>
