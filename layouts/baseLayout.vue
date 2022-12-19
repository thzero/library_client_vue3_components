<script>
import { computed } from 'vue';

import Constants from '@/constants';

import base from '../components/base';

export default {
	name: 'BaseLayout',
	extends: base,
	setup(props) {
		const features = computed(() => {
			return Constants.Features;
		});

		return Object.assign(base.setup(props), {
			features
		});
	}
};
</script>

<style scoped>
</style>
