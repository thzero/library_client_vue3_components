<script>
import { computed, getCurrentInstance } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from '../base';

export default {
	name: 'baseMarkdown',
	extends: base,
	props: {
		useGithub: {
			type: Boolean,
			default: true
		},
		// must be included in props
		modelValue: {
			type: String,
			default: ''
		}
	},
	setup (props) {
		const instance = getCurrentInstance();

		const serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

		const markdownClass = computed(() => {
			return 'markdown ' + (props.useGithub ? 'markdown-body' : '');
		});

		const display = computed(() => {
			if (String.isNullOrEmpty(props.modelValue))
				return '';

			const correlationId = instance.ctx.correlationId();
			const results = serviceMarkup.render(correlationId, props.modelValue);
			return serviceMarkup.trimResults(correlationId, results);
		});

		return Object.assign(base.setup(props), {
			display,
			markdownClass,
			serviceMarkup
		});
	}
	// computed: {
	// 	display() {
	// 		const correlationId = this.correlationId();
	// 		return this._serviceMarkup.trimResults(correlationId, instance._serviceMarkup.render(correlationId, this.value));
	// 	}
	// },
	// created() {
	// 	this._serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);
	// }
};
</script>

<style>
	@import 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css';
	.markdown ol, ul, li {
		margin: revert;
		padding: revert; /* Padding is what gives the indentation */
	}
</style>
