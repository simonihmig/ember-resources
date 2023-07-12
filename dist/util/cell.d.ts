interface GlintRenderable {
    /**
     * Cells aren't inherently understood by Glint,
     * so to work around that, we'll hook in to the fact that
     * ContentValue (the type expected for all renderables),
     * defines an interface with this signature.
     *
     * (SafeString)
     *
     * There *has* been interest in the community to formally support
     * toString and toHTML APIs across all objects. An RFC needs to be
     * written so that we can gather feedback / potential problems.
     */
    toHTML(): string;
}
declare class Cell<Value = unknown> implements GlintRenderable {
    current: Value;
    toHTML(): string;
    constructor();
    constructor(initialValue: Value);
    /**
     * Toggles the value of `current` only if
     * `current` is a boolean -- errors otherwise
     */
    toggle: () => void;
    /**
     * Updates the value of `current`
     * by calling a function that receives the previous value.
     */
    update: (updater: (prevValue: Value) => Value) => void;
    /**
     * Updates the value of `current`
     */
    set: (nextValue: Value) => void;
    /**
     * Returns the current value.
     */
    read: () => Value;
}
/**
 * <div class="callout note">
 *
 * This is not a core part of ember-resources, but is a useful utility when working with Resources. This utility is still under the broader library's SemVer policy. Additionally, the "Cell" is a core concept in Starbeam. See [Cells in Starbeam](https://www.starbeamjs.com/guides/fundamentals/cells.html)
 *
 * </div>
 *
 *
 * Small state utility for helping reduce the number of imports
 * when working with resources in isolation.
 *
 * The return value is an instance of a class with a single
 * `@tracked` property, `current`. If `current` is a boolean,
 * there is a `toggle` method available as well.
 *
 * For example, a Clock:
 *
 * ```js
 * import { resource, cell } from 'ember-resources';
 *
 * const Clock = resource(({ on }) => {
 *   let time = cell(new Date());
 *   let interval = setInterval(() => time.current = new Date(), 1000);
 *
 *   on.cleanup(() => clearInterval(interval));
 *
 *   let formatter = new Intl.DateTimeFormat('en-US', {
 *     hour: 'numeric',
 *     minute: 'numeric',
 *     second: 'numeric',
 *     hour12: true,
 *   });
 *
 *   return () => formatter.format(time.current);
 * });
 *
 * <template>
 *   It is: <time>{{Clock}}</time>
 * </template>
 * ```
 *
 * Additionally, cells can be directly rendered:
 * ```js
 * import { resource, cell } from 'ember-resources';
 *
 * const value = cell(0);
 *
 * <template>
 *    {{value}}
 * </template>
 * ```
 *
 */
declare function cell<Value = unknown>(initialValue?: Value): Cell<Value>;
export { Cell, cell };
