import { Hono } from 'hono';
import type { Env } from './env';

import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono<Env>();
app.use('*', logger());
app.use('*', secureHeaders());

interface NixosSearchParams {
	type: 'packages' | 'options';
	name: string;
	channel?: string;
}

const makeNixosSearch = ({ type, name, channel }: NixosSearchParams) => {
	const base = new URL(`https://search.nixos.org/${type}`);
	base.searchParams.set('channel', channel ?? 'unstable');
	base.searchParams.set('show', name);

	return base.toString();
};

const makeRedirect = (opts: NixosSearchParams) => {
	const dest = makeNixosSearch(opts);
	return new Response(`Redirecting to ${dest}`, {
		status: 302,
		headers: { 'content-type': 'text/plain; charset=utf-8', location: dest },
	});
};

app
	.route('/option')
	.get('/:opt', (c) =>
		makeRedirect({
			type: 'options',
			name: c.req.param('opt'),
		})
	)
	.get('/:channel/:opt', (c) =>
		makeRedirect({
			type: 'options',
			name: c.req.param('opt'),
			channel: c.req.param('channel'),
		})
	);

app.get('/:pkg', (c) =>
	makeRedirect({
		type: 'packages',
		name: c.req.param('pkg'),
	})
);

app.get('/:channel/:pkg', (c) =>
	makeRedirect({
		type: 'packages',
		name: c.req.param('pkg'),
		channel: c.req.param('channel'),
	})
);

export default app;
