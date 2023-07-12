import { resourceFactory } from '../core/function-based/immediate-invocation.js';
import { resource } from '../core/function-based/resource.js';

const isEmpty = x => {
  if (Array.isArray(x)) {
    return x.length === 0;
  }
  if (typeof x === 'object') {
    if (x === null) return true;
    return Object.keys(x).length === 0;
  }
  return x !== 0 && !x;
};
/**
 * <div class="callout note">
 *
 * This is not a core part of ember-resources, but is an example utility to demonstrate a concept when authoring your own resources. However, this utility is still under the broader library's SemVer policy.
 *
 * A consuming app will not pay for the bytes of this utility unless imported.
 *
 * </div>
 *
 * A utility decorator for smoothing out changes in upstream data between
 * refreshes / reload.
 *
 * @example
 * when using RemoteData (or some other promise-based "eventually a value" resource),
 * the value returned from the API is what's useful to see to users. But if the URL
 * changes, the remote request will start anew, and isLoading becomes true, and the value is falsey until the request finishes. This can result in some flicker
 * until the new request finishes.
 *
 * To smooth that out, we can use [[keepLatest]]
 *
 * ```js
 *  import { RemoteData } from 'ember-resources/util/remote-data';
 *  import { keepLatest } from 'ember-resources/util/keep-latest';
 *
 *  class A {
 *    @use request = RemoteData(() => 'some url');
 *    @use data = keepLatest({
 *      value: () => this.request.value,
 *      when: () => this.request.isLoading,
 *    });
 *
 *    get result() {
 *      // after the initial request, this is always resolved
 *      return this.data;
 *    }
 *  }
 * ```
 */
function keepLatest({
  when,
  value: valueFn
}) {
  return resource(() => {
    let previous;
    return () => {
      let value = valueFn();
      if (when()) {
        return previous = isEmpty(value) ? previous : value;
      }
      return previous = value;
    };
  });
}
resourceFactory(keepLatest);

export { keepLatest };
//# sourceMappingURL=keep-latest.js.map
