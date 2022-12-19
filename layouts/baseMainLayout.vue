<script>
import { getCurrentInstance, computed, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import baseLayout from './baseLayout';

import DialogSupport from '@/library_vue/components/support/dialog';

export default {
	name: 'BaseMainLayout',
	extends: baseLayout,
	setup(props) {
		const instance = getCurrentInstance();

		const serviceAuth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);
		const serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);

		const closeOnContentClick = ref(true);
		const dialogSignOut = ref(new DialogSupport());

		const isAuthCompleted = computed(() => {
			return instance.ctx.serviceStore.user != null ? instance.ctx.serviceStore.userAuthCompleted : false;
		});
		const isLoggedIn = computed(() => {
			return instance.ctx.serviceStore.user != null ? instance.ctx.serviceStore.userAuthIsLoggedIn : false;
		});

		const clickAbout = () => {
			GlobalUtility.$navRouter.push('/about');
		};
		const clickOpenSource = () => {
			GlobalUtility.$navRouter.push('/openSource');
		};
		const clickSignIn = () => {
			GlobalUtility.$navRouter.push('/auth');
		};
		const clickSignOut = async () => {
			dialogSignOut.value.open();
		};
		const clickSupport = () => {
			GlobalUtility.$navRouter.push('/support');
		};
		const dialogSignOutOk = async () => {
			dialogSignOut.value.ok();
			await instance.ctx.serviceAuth.signOut(instance.ctx.correlationId());
		};
		const toggleDrawer = async () => {
			GlobalUtility.$EventBus.emit('toggle-drawer');
		};

		return Object.assign(baseLayout.setup(props), {
			closeOnContentClick,
			clickAbout,
			clickOpenSource,
			clickSignIn,
			clickSignOut,
			clickSupport,
			dialogSignOut,
			dialogSignOutOk,
			isAuthCompleted,
			isLoggedIn,
			serviceAuth,
			serviceStore,
			toggleDrawer
		});
	}
};
</script>
