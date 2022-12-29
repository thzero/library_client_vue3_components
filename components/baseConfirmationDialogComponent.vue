
<script>
import { ref, watch } from 'vue';

// import base from './base';
import { useBaseComponent } from './base';

export function useBaseConfirmationDialogComponent(props, context, initializeI, handleErrorI) {
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

	const dialogSignal = ref(false);
	const internalItem = ref(null);

	const dialogCancel = () => {
		dialogSignal.value = false;
		$emit('cancel');
	};
	const dialogOk = async () => {
		const correlationIdI = correlationId();
		if (props.preCompleteOk) {
			const response = await props.preCompleteOk(correlationIdI);
			logger.debug('useBaseConfirmationDialogComponent', 'dialogOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				handleError(response, correlationIdI);
				return;
			}
		}

		dialogSignal.value = false;
		context.emit('ok');
		if (props.completeOk)
			props.completeOk();
	};
	const handleError = (response, correlationId) => {
		if (handleErrorI)
			handleErrorI(response, correlationId);
	};

	// watch(dialogSignal, async (value) => {
	// 	dialogSignal.value = value;
	// });
	watch(() => props.signal,
		(value) => {
			dialogSignal.value = value;
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
		dialogCancel,
		dialogOk,
		dialogSignal,
		handleError,
		internalItem
	};
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