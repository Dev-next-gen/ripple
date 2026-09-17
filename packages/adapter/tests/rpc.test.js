import { afterEach, describe, expect, it } from 'vitest';
import { patch_global_fetch } from '../src/rpc.js';

describe('patch_global_fetch', () => {
	/** @type {ReturnType<typeof patch_global_fetch> | null} */
	let fetch_handle = null;

	afterEach(() => {
		fetch_handle?.restore();
		fetch_handle = null;
	});

	it('applies init to a same-origin Request routed to the handler', async () => {
		const store = { origin: 'http://localhost:3000' };
		fetch_handle = patch_global_fetch({
			run: (_store, fn) => fn(),
			getStore: () => store,
		});

		/** @type {{ method: string, body: string, header: string | null } | null} */
		let received = null;
		fetch_handle.set_handler(async (request) => {
			received = {
				method: request.method,
				body: await request.text(),
				header: request.headers.get('x-test'),
			};
			return new Response('ok');
		});

		const response = await fetch(new Request('http://localhost:3000/api/items'), {
			method: 'POST',
			body: 'payload',
			headers: { 'x-test': '1' },
		});

		expect(await response.text()).toBe('ok');
		expect(received).toEqual({ method: 'POST', body: 'payload', header: '1' });
	});
});
