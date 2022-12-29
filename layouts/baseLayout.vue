<script>
import { computed } from 'vue';

import Constants from '@/constants';

import { useBaseComponent } from '../components/base';

export function useBaseLayout(props, context, initializeI) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	} = useBaseComponent(props, context, initializeI);

	const features = computed(() => {
		return Constants.Features;
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
		features
	};
};
</script>
