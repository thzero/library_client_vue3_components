<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import GlobalUtility from '@thzero/library_client/utility/global';

import baseEdit from './baseEdit';

export default {
	name: 'BaseEditPage',
	extends: baseEdit,
	setup (props) {
		const instance = getCurrentInstance();

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
			if (!instance.ctx.leaveCheck())
				return;

			next();
		});
		
		onMounted(async () => {
			window.addEventListener('beforeunload', instance.ctx.beforeUnload);
		});
		onUnmounted(async () => {
			 window.removeEventListener('beforeunload', instance.ctx.beforeUnload);
		});

		return Object.assign(baseEdit.setup(props), {
			beforeUnload,
			dirty,
			dirtyCheck,
			leaveCheck
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
