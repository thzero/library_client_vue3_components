<script>
import { onMounted, onUnmounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import GlobalUtility from '@thzero/library_client/utility/global';

// import baseEdit from './baseEdit';
import { useBaseEditComponent } from './baseEdit';

export function useBasePageEditComponent(props, context, initializeI) {
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

	const dirty = ref(false);

	const dirtyCheck = (correlationId, controlDirtyState) => {
		return dirty.value = controlDirtyState;
	};
	const leaveCheck = () => { 
		if (!dirty.value)
			return true;

		const result = window.confirm(GlobalUtility.$trans.t('questions.formDirty'));
		return result;
	};
	const beforeUnload = (event) => {
		if (!dirty.value)
			return;

		return event.returnValue = GlobalUtility.$trans.t('questions.formDirty');
	};
	
	onBeforeRouteLeave(async (to, from, next) => {
		if (!leaveCheck())
			return;

		next();
	});
	
	onMounted(async () => {
		window.addEventListener('beforeunload', beforeUnload);
	});
	onUnmounted(async () => {
		window.removeEventListener('beforeunload', beforeUnload);
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
		leaveCheck
	};
	// data: () => ({
	// 	innerValue: null,
	// 	watch: null
	// }),
	// computed: {
	// 	errorI() {
	// 		return this.validation ? this.validation[this.vid] ? this.validation[this.vid].$error : false : true;
	// 	},
	// 	errorsI() {
	// 		return this.validation ? this.validation[this.vid] ? this.validation[this.vid].$errors : [] : [];
	// 	}
	// },
	// watch: {
	// 	// Handles external model changes.
	// 	modelValue(newVal) {
	// 		this.initValue(newVal);
	// 	}
	// },
	// methods: {
	// 	initValue(value) {
	// 		this.innerValue = value;
	// 		if (this.watch)
	// 			return;

	// 		this.watch = this.$watch('innerValue', async (newVal) => {
	// 			this.$emit('update:modelValue', newVal);
	// 		});
	// 	}
	// },
	// mounted() {
	// 	this.initValue(this.modelValue);
	// }
};
</script>
