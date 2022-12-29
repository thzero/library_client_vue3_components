<script>
import { computed, ref, watch } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseEditComponent } from '@/library_vue/components/baseEdit';

import DialogSupport from '@/library_vue/components/support/dialog';

export function useBaseFormControlComponent(props, context, initializeI) {
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
		setErrors
	} = useBaseEditComponent(props, context, initializeI);
	
	if (!props.dirtyCheck)
		throw Error('Requires dirtyCheck callback.');

	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dirty = ref(false);
	const invalid = ref(true);
	const isClearing = ref(false);
	// const isSaving = ref(false);
	const notifyColor = ref(null);
	const notifyMessage = ref(null);
	const notifySignal = ref(false);
	const notifyTimeout = ref(3000);
	// const serverErrors = ref([]);

	const buttonOkDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return (invalid.value || props.disabled);
	});
	const isDeleting = computed(() => {
		return dialogDeleteConfirmSignal.value.signal;
	});
	const isLoading = computed(() => {
		return isClearing.value || isDeleting.value || isSaving.value;
	});
	const overlayLoading = computed(() => {
		return isSaving.value && props.autoSave;
	});
	
	const handleClear = async (correlationId) => {
		isClearing.value = true;
		try {
			logger.debug('useBaseFormControlComponent', 'clear', 'clear', null, correlationId);
			// $nextTick(() => {
			// 	// $refs.obs.reset(correlationId);
			// });
			await reset(correlationId(), false);
		}
		finally {
			isClearing.value = false;
		}
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(correlationId());
	};
	const handleDeleteConfirmOk = async () => {
		serverErrors.value = [];

		const correlationIdI = correlationId();

		dialogDeleteConfirmSignal.value.ok();

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationIdI);
			logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
			if (hasFailed(response)) {
				// VueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);
				return;
			}
		}

		logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		await handleClear(correlationId);
	};
	const reset = async (correlationId, value) => {
		if (props.resetForm)
			props.resetForm(correlationId, value);
		logger.debug('useBaseFormControlComponent', 'clear', null, null, correlationId);
		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		isSaving.value = false;
		// const timer = setInterval(async () => {
		// 	clearInterval(timer);
		// 	const el = document.getElementsByClassName('v-card__text');
		// 	if (el && el.length > 0)
		// 		el[0].scrollTop = 0;
		// }, 25);
		if (props.notify)
			setNotify('messages.reset');
	};
	const setNotify = (message, transformed) => {
		notifyColor.value = null;
		notifyMessage.value = (!transformed ? GlobalUtility.$trans.t(message) : message);
		notifySignal.value = true;
	};
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			isSaving.value = true;
			serverErrors.value = [];

			const result = await props.validation.$validate();
			logger.debug('useBaseFormControlComponent', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			if (props.preCompleteOk) {
				const response = await props.preCompleteOk(correlationIdI);
				logger.debug('useBaseFormControlComponent', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					// TODO
					// VueUtility.handleError($refs.obs, instance.ctx.serverErrors, response, correlationIdI);
					return;
				}
			}

			await props.validation.$reset();
			logger.debug('useBaseFormControlComponent', 'submit', 'ok', null, correlationIdI);
			context.emit('ok');

			if (props.notify)
				setNotify('messages.saved');
		}
		catch (err) {
			logger.exception('useBaseFormControlComponent', 'submit', err, correlationIdI);
		}
		finally {
			isSaving.value = false;
		}
	};

	watch(() => props.validation,
		(value) => {
			// console.log('v.invalid: ' + value.$invalid);
			// console.log('v.error: ' + value.$error);
			// console.log('v.errors: ' + JSON.stringify(value));
			invalid.value = value.$invalid;
			dirty.value = value.$anyDirty;
			// console.log('v.invalid: ' + invalid.value);
		}
	);

	watch(() => dirty.value,
		(value) => {
			props.dirtyCheck(correlationId(), dirty);
		}
	);

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
		buttonOkDisabled,
		dialogDeleteConfirmSignal,
		dirty,
		invalid,
		isClearing,
		isDeleting,
		isLoading,
		overlayLoading,
		handleClear,
		handleDelete,
		handleDeleteConfirmOk,
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		reset,
		setNotify,
		submit
	};
};
</script>
