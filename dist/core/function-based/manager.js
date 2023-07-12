import { _ as _defineProperty } from '../../defineProperty-35ce617b.js';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { assert } from '@ember/debug';
import { associateDestroyableChild, registerDestructor, destroy } from '@ember/destroyable';
import { capabilities, invokeHelper } from '@ember/helper';
import { macroCondition, dependencySatisfies, importSync } from '@embroider/macros';
import { Cell } from '../../util/cell.js';
import { INTERNAL } from './types.js';

if (macroCondition(dependencySatisfies('ember-source', '>=4.12.0'))) {
  // In no version of ember where `@ember/owner` tried to be imported did it exist
  // if (macroCondition(false)) {
  // Using 'any' here because importSync can't lookup types correctly
  importSync('@ember/owner').getOwner;
} else {
  // Using 'any' here because importSync can't lookup types correctly
  importSync('@ember/application').getOwner;
}

/**
 * Note, a function-resource receives on object, hooks.
 *    We have to build that manually in this helper manager
 */
class FunctionResourceManager {
  constructor(owner) {
    _defineProperty(this, "capabilities", capabilities('3.23', {
      hasValue: true,
      hasDestroyable: true
    }));
    this.owner = owner;
  }

  /**
   * Resources do not take args.
   * However, they can access tracked data
   */
  createHelper(config) {
    let {
      definition: fn
    } = config;
    /**
     * We have to copy the `fn` in case there are multiple
     * usages or invocations of the function.
     *
     * This copy is what we'll ultimately work with and eventually
     * destroy.
     */
    let thisFn = fn.bind(null);
    let previousFn;
    let usableCache = new WeakMap();
    let owner = this.owner;
    let cache = createCache(() => {
      if (previousFn) {
        destroy(previousFn);
      }
      let currentFn = thisFn.bind(null);
      associateDestroyableChild(thisFn, currentFn);
      previousFn = currentFn;
      const use = usable => {
        assert(`Expected the resource's \`use(...)\` utility to have been passed an object, but a \`${typeof usable}\` was passed.`, typeof usable === 'object');
        assert(`Expected the resource's \`use(...)\` utility to have been passed a truthy value, instead was passed: ${usable}.`, usable);
        assert(`Expected the resource's \`use(...)\` utility to have been passed another resource, but something else was passed.`, INTERNAL in usable);
        let previousCache = usableCache.get(usable);
        if (previousCache) {
          destroy(previousCache);
        }
        let cache = invokeHelper(owner, usable);
        associateDestroyableChild(currentFn, cache);
        usableCache.set(usable, cache);
        return {
          get current() {
            let cache = usableCache.get(usable);
            return getValue(cache);
          }
        };
      };
      let maybeValue = currentFn({
        on: {
          cleanup: destroyer => {
            registerDestructor(currentFn, destroyer);
          }
        },
        use,
        owner: this.owner
      });
      return maybeValue;
    });
    return {
      fn: thisFn,
      cache
    };
  }
  getValue({
    cache
  }) {
    let maybeValue = getValue(cache);
    if (typeof maybeValue === 'function') {
      return maybeValue();
    }
    if (maybeValue instanceof Cell) {
      return maybeValue.current;
    }
    return maybeValue;
  }
  getDestroyable({
    fn
  }) {
    return fn;
  }
}
const ResourceManagerFactory = owner => new FunctionResourceManager(owner);

export { ResourceManagerFactory };
//# sourceMappingURL=manager.js.map
