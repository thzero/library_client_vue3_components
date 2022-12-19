<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from './base';

export default {
	name: 'BaseAuth',
	extends: base,
	setup(props) {
		const serviceFeatures = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_FEATURES);
		const serviceAuth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);

		const allowRememberMe = ref(serviceFeatures && serviceFeatures.features ? serviceFeatures.features.RememberMe : false);
		const authenticated = ref(false);
		const disabled = ref(false);
		const features = ref(serviceFeatures.features);
		const isLoggedIn = ref(false);
		const rememberMe = ref(false);
		
		const display = computed(() => {
			return !isLoggedIn.value;
		});
		
		const instance = getCurrentInstance();

		const signInGoogle = async () => {
			disabled.value = true;
			await instance.ctx.serviceAuth.signIn(instance.ctx.correlationId());
		};

		// onBeforeCreate(async () => {
		// 	authenticated.value = await instance.ctx.serviceAuth.isAuthenticated;
		// 	if (authenticated.value)
		// 		GlobalUtility.$navRouter.push('/');
		// });
		
		onMounted(async () => {
			await instance.ctx.serviceAuth.signInCompleted();
			GlobalUtility.$EventBus.on('auth', isLoggedIn => {
				instance.ctx.logger.debug('BaseAuth', 'mounted', 'isLoggedIn', isLoggedIn, this.correlationId());
				isLoggedIn.value = isLoggedIn;
				disabled.value = isLoggedIn;
			});
		});

		(async () => {
			authenticated.value = await serviceAuth.isAuthenticated;
			if (authenticated.value)
				GlobalUtility.$navRouter.push('/');
		})();

		return Object.assign(base.setup(props), {
			allowRememberMe,
			authenticated,
			disabled,
			display,
			features,
			isLoggedIn,
			rememberMe,
			serviceAuth,
			signInGoogle,
		});
	},
	// data: () => ({
	// 	allowRememberMe: false,
	// 	authenticated: false,
	// 	disabled: false,
	// 	isLoggedIn: false,
	// 	rememberMe: false,
	// 	features: null
	// }),
	// computed: {
	// 	display() {
	// 		return !this.isLoggedIn;
	// 	}
	// },
	// async beforeCreate() {
	// 	this.features = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_FEATURES);
	// 	this.allowRememberMe = this.features && this.features.features ? this.features.features.RememberMe : false;
	// 	this.auth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);
	// 	this.authenticated = await this.auth.isAuthenticated;
	// 	if (this.authenticated)
	// 		GlobalUtility.$navRouter.push('/');
	// },
	// async mounted() {
	// 	await this.auth.signInCompleted();
	// 	GlobalUtility.$EventBus.on('auth', isLoggedIn => {
	// 		this.logger.debug('BaseAuth', 'mounted', 'isLoggedIn', isLoggedIn, this.correlationId());
	// 		this.isLoggedIn = isLoggedIn;
	// 		this.disabled = isLoggedIn;
	// 	});
	// },
	// methods: {
	// 	async signInGoogle() {
	// 		this.disabled = true;
	// 		await this.auth.signIn(this.correlationId());
	// 	}
	// }
};
</script>
