import { _ as _applyDecoratedDescriptor, a as _initializerDefineProperty } from '../applyDecoratedDescriptor-d3d95cf1.js';
import { _ as _defineProperty } from '../defineProperty-35ce617b.js';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { setHelperManager, capabilities } from '@ember/helper';

var _class, _descriptor;
let Cell = (_class = class Cell {
  toHTML() {
    assert('Not a valid API. Please access either .current or .read() if the value of this Cell is needed');
  }
  constructor(initialValue) {
    _initializerDefineProperty(this, "current", _descriptor, this);
    /**
     * Toggles the value of `current` only if
     * `current` is a boolean -- errors otherwise
     */
    _defineProperty(this, "toggle", () => {
      assert(`toggle can only be used when 'current' is a boolean type`, typeof this.current === 'boolean' || this.current === undefined);
      this.current = !this.current;
    });
    /**
     * Updates the value of `current`
     * by calling a function that receives the previous value.
     */
    _defineProperty(this, "update", updater => {
      this.current = updater(this.current);
    });
    /**
     * Updates the value of `current`
     */
    _defineProperty(this, "set", nextValue => {
      this.current = nextValue;
    });
    /**
     * Returns the current value.
     */
    _defineProperty(this, "read", () => this.current);
    if (initialValue !== undefined) {
      this.current = initialValue;
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "current", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class);

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
function cell(initialValue) {
  if (initialValue !== undefined) {
    return new Cell(initialValue);
  }
  return new Cell();
}
class CellManager {
  constructor() {
    _defineProperty(this, "capabilities", capabilities('3.23', {
      hasValue: true
    }));
  }
  createHelper(cell) {
    return cell;
  }
  getValue(cell) {
    return cell.current;
  }
}
const cellEvaluator = new CellManager();
setHelperManager(() => cellEvaluator, Cell.prototype);

export { Cell, cell };
//# sourceMappingURL=cell.js.map
