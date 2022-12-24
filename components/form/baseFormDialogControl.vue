<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import baseEdit from '../baseEdit';

import DialogSupport from '../support/dialog';

export default {
	name: 'BaseFormDialogControl',
	extends: baseEdit,
	props: {
		buttonCancel: {
			type: Boolean,
			default: true
		},
		buttonClear: {
			type: Boolean,
			default: true
		},
		buttonDelete: {
			type: Boolean,
			default: false
		},
		buttonOk: {
			type: Boolean,
			default: true
		},
		fullscreen: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: ''
		},
		maxWidth: {
			type: String,
			default: '600px'
		},
		preCompleteDelete: {
			type: Function,
			default: null
		},
		preCompleteOk: {
			type: Function,
			default: null
		},
		resetDialog: {
			type: Function,
			default: null
		},
		scrollable: {
			type: Boolean,
			default: false
		},
		scrollableAutoResize: {
			type: Boolean,
			default: true
		},
		scrollableAutoResizeFactor: {
			type: Number,
			default: 0.5
		},
		scrollableHeight: {
			type: String,
			default: '500'
		},
		signal: {
			type: Boolean,
			default: false
		},
		validation: {
			type: Object,
			default: null
		},
		width: {
			type: String,
			default: '600px'
		}
	},
	emits: ['close', 'ok', 'open'],
	setup (props) {
		const instance = getCurrentInstance();

		const dialogHeightI = ref(300);
		const dialogDeleteConfirmSignal = ref(new DialogSupport());
		const dialogSignal = ref(false);
		const dirty = ref(false);;
		const loading = ref(false);
		const invalid = ref(true);
		const serverErrors = ref([]);

		const buttonOkDisabled = computed(() => {
			if (dirty.value === false)
				return true;
			return invalid.value;
		});
		const fullscreenInternal = computed(() => {
			return instance.ctx.notImplementedError();
		});
		const scrollableI = computed(() => {
			return props.scrollable ? 'scrollable' : '';
		});
		const scrollableHeightI = computed(() => {
			return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI).value + 'px;' : '';
		});

		const handleClear = () => {
			const correlationId = instance.ctx.correlationId();
			instance.ctx.logger.debug('baseFormDialogControl', 'clear', 'clear', null, correlationId);
			instance.ctx.reset(correlationId, false);
		};
		const handleClose = () => {
			const correlationId = instance.ctx.correlationId();
			serverErrors.value = [];
			dialogSignal.value = false;
			instance.ctx.reset(correlationId);
			instance.ctx.logger.debug('baseFormDialogControl', 'cancel', 'cancel', null, correlationId);
			instance.ctx.$emit('close');
		};
		const handleDelete = async () => {
			serverErrors.value = [];
			dialogDeleteConfirmSignal.value.open(this.correlationId());
		};
		const handleDeleteConfirmOk = async() => {
			serverErrors.value = [];

			const correlationId = instance.ctx.correlationId();

			dialogDeleteConfirmSignal.value.ok();

			if (props.preCompleteDelete) {
				const response = await props.preCompleteDelete(correlationId);
				instance.ctx.logger.debug('baseFormDialogControl', 'handleDeleteConfirmOk', 'response', response, correlationId);
				if (instance.ctx.hasFailed(response)) {
					// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId);
					return;
				}
			}

			dialogSignal.value = false;
			instance.ctx.logger.debug('BaseFormDialogControl', 'handleDeleteConfirmOk', 'delete', null, correlationId);
			instance.ctx.$emit('ok');
			instance.ctx.clear(correlationId);
		};
		const onResize = () => {
			const temp = window.innerHeight - 200;
			dialogHeightI.value = Math.ceil(temp * props.scrollableAutoResizeFactor);
		};
		const reset = async (correlationId, value) => {
			await instance.ctx.resetDialogI(correlationId, value);
			serverErrors.value = [];
			await props.validation.$validate();
			await props.validation.$reset();
			loading.value = false;
		};
		const resetDialogI = async (correlationId, value) => {
			if (props.resetDialog)
				props.resetDialog(correlationId, value);
		};
		const setErrors = (errors) => {
			// instance.ctx.$refs.obs.setErrors(errors);
		};
		const submit = async () => {
			const correlationId = instance.ctx.correlationId();
			try {
				loading.value = true;

				serverErrors.value = [];

				const result = await props.validation.$validate();
				instance.ctx.logger.debug('BaseFormDialogControl', 'submit', 'result', result, correlationId);
				if (!result)
					return;

				let response = { success: true, route: null };
				if (props.preCompleteOk) {
					response = await props.preCompleteOk(correlationId);
					instance.ctx.logger.debug('BaseFormDialogControl', 'submit', 'response', response, correlationId);
					if (instance.ctx.hasFailed(response)) {
						// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId); // TODO
						return;
					}
				}

				dialogSignal.value = false;
				instance.ctx.logger.debug('BaseFormDialogControl', 'submit', 'ok', null, correlationId);
				instance.ctx.$emit('ok');
				instance.ctx.handleClear(correlationId);

				if (!String.isNullOrEmpty(response.route))
					GlobalUtility.$navRouter.push(response.route);
			}
			catch (err) {
				instance.ctx.logger.exception('BaseFormDialogControl', 'submit', err, correlationId);
			}
			finally {
				loading.value = false;
			}
		};

		onMounted(async () => {
			instance.ctx.onResize();
		});

		watch(() => props.signal,
			(value) => {
				const correlationId = instance.ctx.correlationId();
				instance.ctx.$emit(value ? 'open' : 'close');
				instance.ctx.logger.debug('BaseFormDialogControl', 'signal', 'value', value, correlationId);
				dialogSignal.value = value;
				instance.ctx.logger.debug('BaseFormDialogControl', 'signal', 'dialogSignal', dialogSignal.value, correlationId);
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

		return Object.assign(baseEdit.setup(props), {
			buttonOkDisabled,
			dialogHeightI,
			dialogDeleteConfirmSignal,
			dialogSignal,
			dirty,
			fullscreenInternal,
			invalid,
			handleClear,
			handleClose,
			handleDelete,
			handleDeleteConfirmOk,
			loading,
			onResize,
			reset,
			resetDialogI,
			scrollableI,
			scrollableHeightI,
			serverErrors,
			setErrors,
			submit
		});
	},
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
