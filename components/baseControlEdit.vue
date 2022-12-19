<script>
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
			type: null,
			default: null
		}
	},
	setup (props) {
		return Object.assign(baseEdit.setup(props), {
		});
	},
	data: () => ({
		innerValue: null,
		watch: null
	}),
	computed: {
		errorI() {
			return this.validation ? this.validation[this.vid] ? this.validation[this.vid].$error : false : true;
		},
		errorsI() {
			return this.validation ? this.validation[this.vid] ? this.validation[this.vid].$errors : [] : [];
		}
	},
	watch: {
		// Handles external model changes.
		modelValue(newVal) {
			this.initValue(newVal);
		}
	},
	methods: {
		initValue(value) {
			this.innerValue = value;
			if (this.watch)
				return;

			this.watch = this.$watch('innerValue', async (newVal) => {
				this.$emit('update:modelValue', newVal);
			});
		}
	},
	mounted() {
		this.initValue(this.modelValue);
	}
};
</script>
