<script>
import { computed, onMounted, ref, watch } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseEditComponent } from '@/library_vue/components/baseEdit';

import DialogSupport from '../support/dialog';

export function useBaseFormDialogControlComponent(props, context, initializeI) {
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

	const dialogHeightI = ref(300);
	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dialogSignal = ref(false);
	const dirty = ref(false);
	const loading = ref(false);
	const invalid = ref(true);
	const notifyColor = ref(null);
	const notifyMessage = ref(null);
	const notifySignal = ref(false);
	const notifyTimeout = ref(3000);

	const buttonOkDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return invalid.value;
	});
	const scrollableI = computed(() => {
		return props.scrollable ? 'scrollable' : '';
	});
	const scrollableHeightI = computed(() => {
		return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI).value + 'px;' : '';
	});

	const handleClear = () => {
		const correlationIdI = correlationId();
		logger.debug('baseFormDialogControl', 'clear', 'clear', null, correlationIdI);
		reset(correlationIdI, false);
	};
	const handleClose = () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		dialogSignal.value = false;
		reset(correlationIdI);
		logger.debug('baseFormDialogControl', 'cancel', 'cancel', null, correlationIdI);
		context.emit('close');
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(this.correlationId());
	};
	const handleDeleteConfirmOk = async() => {
		serverErrors.value = [];

		const correlationIdI = correlationId();

		dialogDeleteConfirmSignal.value.ok();

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationIdI);
			logger.debug('baseFormDialogControl', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
			if (hasFailed(response)) {
				// TODO
				return;
			}
		}

		dialogSignal.value = false;
		logger.debug('BaseFormDialogControl', 'handleDeleteConfirmOk', 'delete', null, correlationIdI);
		context.emit('ok');
		clear(correlationIdI);
	};
	const onResize = () => {
		const temp = window.innerHeight - 200;
		dialogHeightI.value = Math.ceil(temp * props.scrollableAutoResizeFactor);
	};
	const reset = async (correlationId, notify, options) => {
		if (props.resetDialog)
			props.resetDialog(correlationId, options);
		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		loading.value = false;

		notify = notify !== null || notify !== undefined ? notify : true;
		if (props.notify && notify)
			setNotify(props.notifyMessageReset);
	};
	const setNotify = (message, transformed) => {
		if (String.isNullOrEmpty(message))
			return;

		message = (!transformed ? GlobalUtility.$trans.t(message) : message);
		if (String.isNullOrEmpty(message))
			return;

		notifyColor.value = null;
		notifyMessage.value = (!transformed ? GlobalUtility.$trans.t(message) : message);
		notifySignal.value = true;
	};
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			loading.value = true;

			serverErrors.value = [];

			const result = await props.validation.$validate();
			await props.validation.$reset();
			logger.debug('BaseFormDialogControl', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			let response = { success: true, route: null };
			if (props.preCompleteOk) {
				response = await props.preCompleteOk(correlationIdI);
				logger.debug('BaseFormDialogControl', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationIdI); // TODO
					return;
				}
			}

			dialogSignal.value = false;
			logger.debug('BaseFormDialogControl', 'submit', 'ok', null, correlationId);
			context.emit('ok');
			handleClear(correlationId);

			if (props.notify)
				setNotify(props.notifyMessageSaved);

			if (!String.isNullOrEmpty(response.route))
				GlobalUtility.$navRouter.push(response.route);
		}
		catch (err) {
			logger.exception('BaseFormDialogControl', 'submit', err, correlationId);
		}
		finally {
			loading.value = false;
		}
	};

	onMounted(async () => {
		onResize();
	});

	watch(() => props.signal,
		(value) => {
			const correlationIdI = correlationId();
			context.emit(value ? 'open' : 'close');
			logger.debug('BaseFormDialogControl', 'signal', 'value', value, correlationIdI);
			dialogSignal.value = value;
			logger.debug('BaseFormDialogControl', 'signal', 'dialogSignal', dialogSignal.value, correlationIdI);
		}
	);

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
		dialogHeightI,
		dialogDeleteConfirmSignal,
		dialogSignal,
		dirty,
		invalid,
		handleClear,
		handleClose,
		handleDelete,
		handleDeleteConfirmOk,
		loading,
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		onResize,
		reset,
		scrollableI,
		scrollableHeightI,
		setNotify,
		submit
	};
	// data: () => ({
	// 	dialogHeightI: 300,
	// 	dialogDeleteConfirmSignal: new DialogSupport(),
	// 	dialogSignal: false
	// }),
	// computed: {
	// 	fullscreenInternal() {
	// 		return this.notImplementedError();
	// 	},
	// 	scrollableI() {
	// 		return this.scrollable ? 'scrollable' : '';
	// 	},
	// 	scrollableHeightI() {
	// 		return this.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(this.scrollableHeight) ? this.scrollableHeight : this.dialogHeightI) + 'px;' : '';
	// 	}
	// },
	// watch: {
	// 	// Handles external model changes.
	// 	signal(value) {
	// 		const correlationId = this.correlationId();
	// 		this.$emit(value ? 'open' : 'close');
	// 		this.logger.debug('BaseFormDialogControl', 'signal', 'value', value, correlationId);
	// 		this.dialogSignal = value;
	// 		this.logger.debug('BaseFormDialogControl', 'signal', 'dialogSignal', this.dialogSignal, correlationId);
	// 	}
	// },
	// mounted() {
	// 	this.onResize();
	// },
	// methods: {
	// 	handleClear() {
	// 		const correlationId = this.correlationId();
	// 		this.logger.debug('BaseFormDialogControl', 'clear', 'clear', null, correlationId);
	// 		// this.$nextTick(() => {
	// 		// 	// this.$refs.obs.reset(correlationId);
	// 		// });
	// 		this.reset(correlationId, false);
	// 	},
	// 	async handleDelete() {
	// 		this.serverErrors = [];
	// 		this.dialogDeleteConfirmSignal.open(this.correlationId());
	// 	},
	// 	async handleDeleteConfirmOk() {
	// 		this.serverErrors = [];

	// 		const correlationId = this.correlationId();

	// 		this.dialogDeleteConfirmSignal.ok();

	// 		if (this.preCompleteDelete) {
	// 			const response = await this.preCompleteDelete(correlationId);
	// 			this.logger.debug('BaseFormDialogControl', 'handleDeleteConfirmOk', 'response', response, correlationId);
	// 			if (this.hasFailed(response)) {
	// 				// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId);
	// 				return;
	// 			}
	// 		}

	// 		this.dialogSignal = false;
	// 		this.logger.debug('BaseFormDialogControl', 'handleDeleteConfirmOk', 'delete', null, correlationId);
	// 		this.$emit('ok');
	// 		this.clear(correlationId);
	// 	},
	// 	onResize() {
	// 		const temp = window.innerHeight - 200;
	// 		this.dialogHeightI = Math.ceil(temp * this.scrollableAutoResizeFactor);
	// 	},
	// 	async reset(correlationId, value) {
	// 		await this.resetDialogI(correlationId, value);
	// 		this.serverErrors = [];
	// 		await this.validation.$validate();
	// 	},
	// 	async resetDialogI(correlationId, value) {
	// 		if (this.resetDialog)
	// 			this.resetDialog(correlationId, value);
	// 	},
	// 	// eslint-disable-next-line
	// 	// async resetDialog(correlationId, value) {
	// 	// },
	// 	setErrors(errors) {
	// 		// this.$refs.obs.setErrors(errors);
	// 	},
	// 	async submit() {
	// 		try {
	// 			this.serverErrors = [];

	// 			const correlationId = this.correlationId();

	// 			// const result = await this.$refs.obs.validate(correlationId);
	// 			const result = await this.validation.$validate();
	// 			this.logger.debug('BaseFormDialogControl', 'submit', 'result', result, correlationId);
	// 			if (!result)
	// 				return;

	// 			let response = { success: true, route: null };
	// 			if (this.preCompleteOk) {
	// 				response = await this.preCompleteOk(correlationId);
	// 				this.logger.debug('BaseFormDialogControl', 'submit', 'response', response, correlationId);
	// 				if (this.hasFailed(response)) {
	// 					// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId);
	// 					return;
	// 				}
	// 			}

	// 			this.dialogSignal = false;
	// 			this.logger.debug('BaseFormDialogControl', 'submit', 'ok', null, correlationId);
	// 			this.$emit('ok');
	// 			this.handleClear(correlationId);

	// 			if (!String.isNullOrEmpty(response.route))
	// 				GlobalUtility.$navRouter.push(response.route);
	// 		}
	// 		catch (err) {
	// 			this._logger.exception('BaseFormDialogControl', 'submit', err, correlationId);
	// 		}
	// 	}
	// }
};
</script>
