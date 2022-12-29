export const useBaseFormControlProps = {
	autoSave: {
		type: Boolean,
		default: false
	},
	buttonClear: {
		type: Boolean,
		default: true
	},
	buttonClearName: {
		type: String,
		default: 'buttons.clear'
	},
	buttonDelete: {
		type: Boolean,
		default: false
	},
	buttonDeleteName: {
		type: String,
		default: 'buttons.delete'
	},
	buttonOk: {
		type: Boolean,
		default: true
	},
	buttonOkName: {
		type: String,
		default: 'buttons.ok'
	},
	dirtyCheck: {
		type: Function,
		default: () => null
	},
	disabled: {
		type: Boolean,
		default: false
	},
	label: {
		type: String,
		default: ''
	},
	preCompleteDelete: {
		type: Function,
		default: null
	},
	preCompleteOk: {
		type: Function,
		default: null
	},
	resetForm: {
		type: Function,
		default: null
	},
	validation: {
		type: Object,
		default: null
	}
};
