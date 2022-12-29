<script>
import { computed, onMounted, ref, watch } from 'vue';

// import baseEdit from './baseEdit';
import { useBaseEditComponent } from './baseEdit';

/*
	props: {
		vid: {
			type: String,
			default: ''
		},
		validation: {
			type: Object,
			default: null
		},
		// must be included in props
		modelValue: {
			default: null
		}
	},
*/
export function useBaseControlEditComponent(props, context, initializeI, convertValueI) {
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

	const innerValue = ref(null);
	// const watchInner = ref(null);

	const convertValue = (value) => {
		if (convertValueI)
			return convertValueI(value);
		return value;
	};
	const errorI = computed(() => {
		return props.validation ? props.validation[props.vid] ? props.validation[props.vid].$silentErrors && (props.validation[props.vid].$silentErrors.length > 0) : false : true;
	});
	const errorsI = computed(() => {
		return props.validation ? props.validation[props.vid] ? props.validation[props.vid].$silentErrors : [] : [];
	});
	const hideDetails = computed(() => {
		return (!errorsI || (errorsI && errorsI.length === 0));
	});
	const initValue = (value) => {
		innerValue.value = convertValue(value);
		// if (watchInner.value)
		// 	return;

		// watchInner.value = context.watch('innerValue', async (newVal) => {
		// 	context.emit('update:modelValue', newVal);
		// });
	};

	const innerValueUpdate = (value) => {
		if (props.change)
			props.change(value);

		context.emit('update:modelValue', value);
	};

	onMounted(async () => {
		initValue(props.modelValue);
	});

	watch(() => props.modelValue,
		(value) => {
			initValue(value);
		}
	);
	watch(() => innerValue,
		(value) => {
			context.emit('update:modelValue', value);
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
		convertValue,
		errorI,
		errorsI,
		hideDetails,
		innerValue,
		innerValueUpdate,
		initValue
	}
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
