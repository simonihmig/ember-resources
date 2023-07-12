import { INTERNAL } from "../function-based/types.js";
/**
 * NOTE:
 *  Empty, EmptyObject, and GetOrElse are copied from @glimmer/component
 */
type Fn = (...args: any[]) => any;
type Constructor<Instance> = abstract new (...args: any) => Instance;
interface Class<Instance> {
    new (...args: unknown[]): Instance;
}
/**
 * @private utility type
 */
type NoArgs = {
    named: EmptyObject;
    positional: [
    ];
};
/**
 * This is a utility interface that represents the resulting args structure after
 * the thunk is normalized.
 */
interface ArgsWrapper {
    positional?: unknown[];
    named?: Record<string, any>;
}
// Type-only "symbol" to use with `EmptyObject` below, so that it is *not*
// equivalent to an empty interface.
declare const Empty: unique symbol;
/**
 * This provides us a way to have a "fallback" which represents an empty object,
 * without the downsides of how TS treats `{}`. Specifically: this will
 * correctly leverage "excess property checking" so that, given a component
 * which has no named args, if someone invokes it with any named args, they will
 * get a type error.
 *
 * internal: This is exported so declaration emit works (if it were not emitted,
 *   declarations which fall back to it would not work). It is *not* intended for
 *   public usage, and the specific mechanics it uses may change at any time.
 *   The location of this export *is* part of the public API, because moving it
 *   will break existing declarations, but is not legal for end users to import
 *   themselves, so ***DO NOT RELY ON IT***.
 */
type EmptyObject = {
    [Empty]?: true;
};
type GetOrElse<Obj, K, Fallback> = K extends keyof Obj ? Obj[K] : Fallback;
/**
 * @private utility type
 * Used in the Resource.from methods.
 * Only takes fully defined args (including positional and named keys)
 */
type AsThunk<Args, Expanded = ThunkReturnFor<Args>> = Expanded extends NoArgs ? () => NoArgs | [
] | EmptyObject | undefined | void : () => LoosenThunkReturn<Expanded>;
/**
 * @private utility type
 *
 * Converts a variety of types to the expanded arguments type
 * that aligns with the 'Args' portion of the 'Signature' types
 * from ember's helpers, modifiers, components, etc
 *
 * tl;dr:
 *   converts Signature-style args o thunk/glimmer args
 *   - { Named: ... } => { named: ... }
 *   - { Positional: ... } => { positional: ... }
 *
 *   This is the *full* type, which is useful for then loosening later
 *
 */
// export type ExpandThunkReturn<T> = T extends any[]
//   ? ThunkReturnFor<{ positional: T }>
//   : T extends { positional: unknown[] }
//   ? ThunkReturnFor<T>
//   : T extends { named: unknown }
//   ? ThunkReturnFor<T>
//   : T extends object
//   ? ThunkReturnFor<{ named: T }>
//   : never;
/**
 * @private utility type
 *
 * Normalizes the different Arg-types into the thunk-args type, which is
 * lowercase positional and named, where as the Signature-args are
 * uppercase
 */
type ThunkReturnFor<S> = S extends {
    named?: object;
    positional?: unknown[];
} ? {
    positional: GetOrElse<S, "positional", [
    ]>;
    named: GetOrElse<S, "named", EmptyObject>;
} : S extends {
    Named?: object;
    Positional?: unknown[];
} ? {
    positional: GetOrElse<S, "Positional", [
    ]>;
    named: GetOrElse<S, "Named", EmptyObject>;
} : NoArgs;
/**
 * @private utility type
 *
 * Because our thunks have a couple shorthands for positional-only
 * and named-only usages, this utility type expands a full thunk-arg type
 * to include those optional shorthands
 */
type LoosenThunkReturn<Args> = Args extends {
    positional: unknown[];
    named: EmptyObject;
} ? {
    positional: Args["positional"];
} | Args["positional"] : Args extends {
    positional: [
    ];
    named: object;
} ? {
    named: Args["named"];
} | Args["named"] : Args;
/**
 * A generic function type that represents the various formats a Thunk can be in.
 *
 *  - The thunk is "just a function" that allows tracked data to be lazily consumed by the resource.
 *
 * Note that thunks are awkward when they aren't required -- they may even be awkward
 * when they are required. Whenever possible, we should rely on auto-tracking, such as
 * what trackedFunction provides.
 *
 * So when and why are thunks needed?
 * - when we want to manage reactivity *separately* from a calling context.
 * - in many cases, the thunk is invoked during setup and update of various Resources,
 *   so that the setup and update evaluations can "entangle" with any tracked properties
 *   accessed within the thunk. This allows changes to those tracked properties to
 *   cause the Resources to (re)update.
 *
 * The args thunk accepts the following data shapes:
 * ```
 * () => [an, array]
 * () => ({ hello: 'there' })
 * () => ({ named: {...}, positional: [...] })
 * ```
 *
 * #### An array
 *
 * when an array is passed, inside the Resource, `this.args.named` will be empty
 * and `this.args.positional` will contain the result of the thunk.
 *
 * _for function resources, this is the only type of thunk allowed._
 *
 * #### An object of named args
 *
 * when an object is passed where the key `named` is not present,
 * `this.args.named` will contain the result of the thunk and `this.args.positional`
 * will be empty.
 *
 * #### An object containing both named args and positional args
 *
 * when an object is passed containing either keys: `named` or `positional`:
 *  - `this.args.named` will be the value of the result of the thunk's `named` property
 *  - `this.args.positional` will be the value of the result of the thunk's `positional` property
 *
 * This is the same shape of args used throughout Ember's Helpers, Modifiers, etc
 *
 * #### For fine-grained reactivity
 *
 * you may opt to use an object of thunks when you want individual properties
 * to be reactive -- useful for when you don't need or want to cause whole-resource
 * lifecycle events.
 *
 * ```
 * () => ({
 *   foo: () => this.foo,
 *   bar: () => this.bar,
 * })
 * ```
 * Inside a class-based [[Resource]], this will be received as the named args.
 * then, you may invoke `named.foo()` to evaluate potentially tracked data and
 * have automatic updating within your resource based on the source trackedness.
 *
 * ```
 * class MyResource extends Resource {
 *   modify(_, named) { this.named = named };
 *
 *   get foo() {
 *     return this.named.foo();
 *   }
 * }
 * ```
 */
type Thunk<Args = ArgsWrapper> = 
// No Args
(() => [
]) | (() => void) | (() => undefined) | (() => ThunkReturnFor<Args>["positional"]) | (() => ThunkReturnFor<Args>["named"]) | (() => Partial<ThunkReturnFor<Args>>) | (() => ThunkReturnFor<Args>);
type ArgsFor<S> = 
// Signature['Args']
S extends {
    Named?: object;
    Positional?: unknown[];
} ? {
    Named: GetOrElse<S, "Named", EmptyObject>;
    Positional: GetOrElse<S, "Positional", [
    ]>;
} : S extends {
    named?: object;
    positional?: unknown[];
} ? {
    Named: GetOrElse<S, "named", EmptyObject>;
    Positional: GetOrElse<S, "positional", [
    ]>;
} : {
    Named: EmptyObject;
    Positional: [
    ];
};
/**
 * Converts a variety of types to the expanded arguments type
 * that aligns with the 'Args' portion of the 'Signature' types
 * from ember's helpers, modifiers, components, etc
 */
type ExpandArgs<T> = T extends any[] ? ArgsFor<{
    Positional: T;
}> : T extends any ? ArgsFor<T> : never;
type Positional<T> = ExpandArgs<T>["Positional"];
type Named<T> = ExpandArgs<T>["Named"];
interface Cache<T = unknown> {
    _: T;
}
interface Helper {
}
interface Stage1DecoratorDescriptor {
    initializer: () => unknown;
}
type Stage1Decorator = (prototype: object, key: string | symbol, descriptor?: Stage1DecoratorDescriptor) => any;
interface ClassResourceConfig {
    thunk: Thunk;
    definition: unknown;
    type: 'class-based';
    [INTERNAL]: true;
}
export { Fn, Constructor, Class, NoArgs, ArgsWrapper, EmptyObject, GetOrElse, ArgsFor, ExpandArgs, Positional, Named, AsThunk, ThunkReturnFor, LoosenThunkReturn, Thunk, Cache, Helper, Stage1DecoratorDescriptor, Stage1Decorator, ClassResourceConfig };
