export type Bindings = Record<string, never>;
export type Variables = Record<string, never>;

export type Env = {
	Bindings: Bindings;
	Variables: Variables;
};
