<script>
import { computed, onMounted, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import Response from '@thzero/library_common/response';

import { useBasePageEditComponent } from '@/library_vue/components/basePageEdit';

export function useBaseSettingsComponent(props, context, initializeI, refForm) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success,
		isSaving,
		serverErrors,
		setErrors,
		beforeUnload,
		dirty,
		dirtyCheck,
		leaveCheck
	} = useBasePageEditComponent(props, context, initializeI);

	const serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);
	const serviceUsers = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);

	const fab = ref(false);
	const requestReset = ref(0);
	const snackbar = ref(false);
	const timeout = ref(2000);

	const hasPicture = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.picture));
	});
	const name = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.name) ? serviceStore.user.external.name : '');
	});
	const picture = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.picture) ? serviceStore.user.external.picture : '');
	});
	const user = computed(() => {
		return serviceStore.user;
	});
	
	const cancel = async () => {
		await reset(correlationId());
	};
	const close = async () => {
	};
	const ok = async () => {
		snackbar = true;
		return true;
	};
	const open = async () => {
	};
	const preComplete = async (correlationId) => {
		const responses = [];

		await preCompleteI(correlationId, responses);

		const response = Response.success(correlationId);
		for (const item of responses)
			response.success &= item.success;
		return response;
	};
	// eslint-disable-next-line
	const preCompleteI = async (correlationId, value) =>  {
	};
	const reset = async (correlationId) => {
		setTimeout(async () => {
			// $refs.form.reset(correlationId);
			await refForm.value.reset(correlationId);
		},
		150);
	};
	// eslint-disable-next-line

	onMounted(async () => {
		await reset(correlationId(), null);
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
		success,
		isSaving,
		serverErrors,
		setErrors,
		beforeUnload,
		dirty,
		dirtyCheck,
		leaveCheck,
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
	};
};
</script>
