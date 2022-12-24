<script>
import { getCurrentInstance, ref, watch } from 'vue';

import base from './base';

export default {
	name: 'BaseConfirmationDialog',
	extends: base,
	props: {
		completeOk: {
			type: Function,
			default: null
		},
		message: {
			type: String,
			default: null
		},
		messageRaw: {
			type: Boolean,
			default: false
		},
		nonRecoverable: {
			type: Boolean,
			default: false
		},
		preCompleteOk: {
			type: Function,
			default: null
		},
		signal: {
			type: Boolean,
			default: false
		}
	},
	emits: ['cancel', 'ok'],
	setup(props) {
		const instance = getCurrentInstance();

		const dialogSignal = ref(false);
		const internalItem = ref(null);

		const dialogCancel = () => {
			dialogSignal.value = false;
			instance.ctx.$emit('cancel');
		};
		const dialogOk = async () => {
			const correlationId = instance.ctx.correlationId();
			if (props.preCompleteOk) {
				const response = await props.preCompleteOk(correlationId);
				instance.ctx.logger.debug('ConfirmationDialog', 'dialogOk', 'response', response, correlationId);
				if (instance.ctx.hasFailed(response)) {
					instance.ctx.handleError(response, correlationId);
					return;
				}
			}

			dialogSignal.value = false;
			instance.ctx.$emit('ok');
			if (props.completeOk)
				props.completeOk();
		};
		const handleError = (response, correlationId) => {
		};

		// watch(dialogSignal, async (value) => {
		// 	dialogSignal.value = value;
		// });
		watch(() => props.signal,
			(value) => {
				dialogSignal.value = value;
			}
		);

		return Object.assign(base.setup(props), {
			dialogCancel,
			dialogOk,
			dialogSignal,
			handleError,
			internalItem,
		});
	},
	// data: () => ({
	// 	dialogSignal: false,
	// 	internalItem: null
	// }),
	// watch: {
	// 	// Handles external model changes.
	// 	signal(value) {
	// 		this.dialogSignal = value;
	// 	}
	// },
	// methods: {
	// 	dialogCancel() {
	// 		this.dialogSignal = false;
	// 		this.$emit('cancel');
	// 	},
	// 	async dialogOk() {
	// 		const correlationId = this.correlationId();
	// 		if (this.preCompleteOk) {
	// 			const response = await this.preCompleteOk(correlationId);
	// 			this.logger.debug('ConfirmationDialog', 'dialogOk', 'response', response, correlationId);
	// 			if (this.hasFailed(response)) {
	// 				this.handleError(response, correlationId);
	// 				return;
	// 			}
	// 		}

	// 		this.dialogSignal = false;
	// 		this.$emit('ok');
	// 		if (this.completeOk)
	// 			this.completeOk();
	// 	},
	// 	handleError(response, correlationId) {
	// 	}
	// }
};
</script>
