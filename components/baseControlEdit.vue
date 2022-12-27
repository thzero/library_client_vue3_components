<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';

import baseEdit from './baseEdit';

export default {
	name: 'BaseEditControl',
	extends: baseEdit,
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
	setup (props) {
		const instance = getCurrentInstance();

		const innerValue = ref(null);
		const watchInner = ref(null);

		const convertValue = (value) => {
			return value;
		};
		const errorI = computed(() => {
			return props.validation ? props.validation[props.vid] ? props.validation[props.vid].$silentErrors && (props.validation[props.vid].$silentErrors.length > 0) : false : true;
		});
		const errorsI = computed(() => {
			return props.validation ? props.validation[props.vid] ? props.validation[props.vid].$silentErrors : [] : [];
		});
		const hideDetails = computed(() => {
			return (!instance.ctx.errorsI || (instance.ctx.errorsI && instance.ctx.errorsI.length === 0));
		});
		const initValue = (value) => {
			innerValue.value = instance.ctx.convertValue(value);
			if (watchInner.value)
				return;

			watchInner.value = instance.ctx.$watch('innerValue', async (newVal) => {
				instance.ctx.$emit('update:modelValue', newVal);
			});
		};

		onMounted(async () => {
			instance.ctx.initValue(props.modelValue);
		});

		watch(() => props.modelValue,
			(value) => {
				instance.ctx.initValue(value);
			}
		);

		return Object.assign(baseEdit.setup(props), {
			convertValue,
			errorI,
			errorsI,
			hideDetails,
			innerValue,
			initValue,
			watchInner
		});
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
