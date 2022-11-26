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
		const hasCopyright = computed(() => {
			return props.value.client && props.value.client.copyright && props.value.client.author;
		});

		const innerVersion = computed(() => {
			return props.value;
		});

		return Object.assign(base.setup(props), {
			hasCopyright,
			innerVersion
		});
	}
};
</script>
