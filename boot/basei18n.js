import { createI18n } from 'vue-i18n';

import GlobalUtility from '@thzero/library_client/utility/global';

import Basei18n from '@thzero/library_client/boot/basei18n';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

class VueBasei18n extends Basei18n {
	// eslint-disable-next-line
	async execute(framework, app, router, store) {
		// Set i18n instance on app
		const i18n = createI18n({
			locale: 'en-us',
			fallbackLocale: 'en',
			messages: this._initMessages(), // messages,
			silentTranslationWarn: true
		});
		framework.use(i18n);
		GlobalUtility.i18n = i18n.global;
		GlobalUtility.$trans = i18n.global;
	}

	_initMessages() {
		throw new NotImplementedError();
	}
}

export default VueBasei18n;
