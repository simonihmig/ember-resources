import { ArgsWrapper, Thunk } from "./types/base.js";
declare const DEFAULT_THUNK: () => never[];
declare function normalizeThunk(thunk?: Thunk): ArgsWrapper;
export { DEFAULT_THUNK, normalizeThunk };
