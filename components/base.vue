<script>
import { ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import LibraryUtility from '@thzero/library_common/utility';
import GlobalUtility from '@thzero/library_client/utility/global';

import Response from '@thzero/library_common/response';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

export function useBaseComponent(props, context, initializeI) {
	const logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);

	const correlationId = () => {
		return LibraryUtility.generateId();
	};
	const error = (clazz, method, message, err, code, errors, correlationId) => {
		return Response.error(clazz, method, message, err, code, errors, correlationId);
	};
	const hasFailed = (response) => {
		return Response.hasFailed(response);
	};
	const hasSucceeded = (response) => {
		return Response.hasSucceeded(response);
	};
	const initialize = async () => {
		if (initializeI)
			return await initializeI();
		return null;
	};
	const noBreakingSpaces = () => {
		return '\xa0';
	};
	const notImplementedError = () => {
		throw new NotImplementedError();
	};
	const success = (correlationId) => {
		return Response.success(correlationId);
	};

	return {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	};
};
</script>
