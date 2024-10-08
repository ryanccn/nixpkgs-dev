import { Hono } from 'hono';
import type { Env } from './env';

import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import index from './index.txt';

const app = new Hono<Env>();
app.use(logger());
app.use(secureHeaders());

interface NixosSearchParams {
	type: 'packages' | 'options';
	name: string;
	channel?: string;
}

const makeNixosSearch = ({ type, name, channel }: NixosSearchParams) => {
	const base = new URL(`https://search.nixos.org/${encodeURIComponent(type)}`);
	base.searchParams.set('channel', channel ?? 'unstable');
	base.searchParams.set('show', name);

	return base.toString();
};

const makeRedirect = (dest: string) => {
	return new Response(`Redirecting to ${dest}`, {
		status: 302,
		headers: { 'content-type': 'text/plain; charset=utf-8', location: dest },
	});
};

const makeNixosRedirect = (opts: NixosSearchParams) => makeRedirect(makeNixosSearch(opts));

app.get(
	'/',
	() =>
		new Response(index, {
			headers: { 'content-type': 'text/plain; charset=utf-8' },
		})
);

app.get('/pr/:id', (c) =>
	makeRedirect(`https://github.com/NixOS/nixpkgs/pull/${encodeURIComponent(c.req.param('id'))}`)
);
app.get('/pull/:id', (c) =>
	makeRedirect(`https://github.com/NixOS/nixpkgs/pull/${encodeURIComponent(c.req.param('id'))}`)
);

app.get('/docs', () => makeRedirect(`https://ryantm.github.io/nixpkgs/`));
app.get('/docs/:rest{.+}', (c) => makeRedirect(`https://ryantm.github.io/nixpkgs/${c.req.param('rest')}`));

app.get('/option/:opt', (c) =>
	makeNixosRedirect({
		type: 'options',
		name: c.req.param('opt'),
	})
);

app.get('/option/:channel/:opt', (c) =>
	makeNixosRedirect({
		type: 'options',
		name: c.req.param('opt'),
		channel: c.req.param('channel'),
	})
);

app.get('/:pkg', (c) =>
	makeNixosRedirect({
		type: 'packages',
		name: c.req.param('pkg'),
	})
);

app.get('/:channel/:pkg', (c) =>
	makeNixosRedirect({
		type: 'packages',
		name: c.req.param('pkg'),
		channel: c.req.param('channel'),
	})
);

export default app;
