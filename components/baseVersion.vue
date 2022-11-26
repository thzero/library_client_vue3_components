<script>
import { computed } from 'vue';
import base from './base';
export default {
	name: 'BaseVersion',
	extends: base,
	props: {
		value: {
			type: Object,
			default: null
		}
	},
	setup(props) {
		const author = computed(() => {
			return props.value.client && props.value.client.author ? props.value.client.author : '';
		});
		const authorUrl = computed(() => {
			return props.value.client && props.value.client.author_url ? props.value.client.author_url : '';
		});
		const copyright = computed(() => {
			return props.value.client && props.value.client.copyright ? props.value.client.copyright : '';
		});
		const hasAuthor = computed(() => {
			return props.value.client && props.value.client.author;
		});
		const hasAuthorUrl = computed(() => {
			return props.value.client && props.value.client.author_url && props.value.client.author_url;
		});
		const hasCopyright = computed(() => {
			return props.value.client && props.value.client.copyright && props.value.client.author;
		});
		const innerVersion = computed(() => {
			return props.value;
		});
		return Object.assign(base.setup(props), {
			author,
			authorUrl,
			copyright,
			hasAuthor,
			hasAuthorUrl,
			hasCopyright,
			innerVersion
		});
	}
};
</script>