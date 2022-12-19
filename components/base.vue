<script>
import { ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import LibraryUtility from '@thzero/library_common/utility';
import GlobalUtility from '@thzero/library_client/utility/global';

import Response from '@thzero/library_common/response';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

export default {
	name: 'BaseComponent',
	setup(props) {
		const logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);
		
		const serverErrors = ref([]);

		const correlationId = () => {
			return LibraryUtility.generateId();
		};
		const clone = (value) => {
			return LibraryUtility.cloneDeep(value);
		};
		const error = (clazz, method, message, err, code, errors, correlationId) => {
			return Response.error(clazz, method, message, err, code, errors, correlationId);
		};
		const getDateHuman = (date) => {
			return LibraryUtility.getDateHuman(date);
		};
		const hasFailed = (response) => {
			return Response.hasFailed(response);
		};
		const hasSucceeded = (response) => {
			return Response.hasSucceeded(response);
		};
		const initialize = async () => {
			return null;
		};
		const noBreakingSpaces = () => {
			return '\xa0';
		};
		const notImplementedError = () => {
			throw new NotImplementedError();
		};
		const observerIsNull = (value) => {
			return !value || Object.keys(value).length === 0;
		};
		const success = (correlationId) => {
			return Response.success(correlationId);
		};

		return {
			clone,
			correlationId,
			error,
			getDateHuman,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			observerIsNull,
			serverErrors,
			success
		};
	},
	// data: () => ({
	// 	logger: null,
	// 	utility: null,
	// 	serverErrors: []
	// }),
	// async created() { // TODO: to setup() https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8
	// 	this.logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);
	// },
	// methods: { // TODO: to setup() https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8
	// 	correlationId() {
	// 		return LibraryUtility.generateId();
	// 	},
	// 	clone(value) {
	// 		return LibraryUtility.cloneDeep(value);
	// 	},
	// 	error(clazz, method, message, err, code, errors, correlationId) {
	// 		return Response.error(clazz, method, message, err, code, errors, correlationId);
	// 	},
	// 	getDateHuman(date) {
	// 		return LibraryUtility.getDateHuman(date);
	// 	},
	// 	hasFailed(response) {
	// 		return Response.hasFailed(response);
	// 	},
	// 	hasSucceeded(response) {
	// 		return Response.hasSucceeded(response);
	// 	},
	// 	noBreakingSpaces() {
	// 		return '\xa0';
	// 	},
	// 	notImplementedError() {
	// 		throw new NotImplementedError();
	// 	},
	// 	observerIsNull(value) {
	// 		return !value || Object.keys(value).length === 0;
	// 	},
	// 	success(correlationId) {
	// 		return Response.success(correlationId);
	// 	}
	// },
	// methods: {
	// 	async initialize() {
	// 		return null;
	// 	}
	// }
};
</script>
