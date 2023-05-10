import lib_d_ts from "./lib.d.ts?raw";
import lib_dom_d_ts from "./lib.dom.d.ts?raw";
import lib_dom_iterable_d_ts from "./lib.dom.iterable.d.ts?raw";
import lib_webworker_d_ts from "./lib.webworker.d.ts?raw";
import lib_webworker_importscripts_d_ts from "./lib.webworker.importscripts.d.ts?raw";
import lib_scripthost_d_ts from "./lib.scripthost.d.ts?raw";
import lib_es5_d_ts from "./lib.es5.d.ts?raw";
import lib_es6_d_ts from "./lib.es6.d.ts?raw";
import lib_es2015_collection_d_ts from "./lib.es2015.collection.d.ts?raw";
import lib_es2015_core_d_ts from "./lib.es2015.core.d.ts?raw";
import lib_es2015_d_ts from "./lib.es2015.d.ts?raw";
import lib_es2015_generator_d_ts from "./lib.es2015.generator.d.ts?raw";
import lib_es2015_iterable_d_ts from "./lib.es2015.iterable.d.ts?raw";
import lib_es2015_promise_d_ts from "./lib.es2015.promise.d.ts?raw";
import lib_es2015_proxy_d_ts from "./lib.es2015.proxy.d.ts?raw";
import lib_es2015_reflect_d_ts from "./lib.es2015.reflect.d.ts?raw";
import lib_es2015_symbol_d_ts from "./lib.es2015.symbol.d.ts?raw";
import lib_es2015_symbol_wellknown_d_ts from "./lib.es2015.symbol.wellknown.d.ts?raw";

const fsMap = new Map();
fsMap.set("/lib.d.ts", lib_d_ts);
fsMap.set("/lib.dom.d.ts", lib_dom_d_ts);
fsMap.set("/lib.dom.iterable.d.ts", lib_dom_iterable_d_ts);
fsMap.set("/lib.webworker.d.ts", lib_webworker_d_ts);
fsMap.set(
  "/lib.webworker.importscripts.d.ts",
  lib_webworker_importscripts_d_ts
);
fsMap.set("/lib.scripthost.d.ts", lib_scripthost_d_ts);
fsMap.set("/lib.es5.d.ts", lib_es5_d_ts);
fsMap.set("/lib.es6.d.ts", lib_es6_d_ts);
fsMap.set("/lib.es2015.collection.d.ts", lib_es2015_collection_d_ts);
fsMap.set("/lib.es2015.core.d.ts", lib_es2015_core_d_ts);
fsMap.set("/lib.es2015.d.ts", lib_es2015_d_ts);
fsMap.set("/lib.es2015.generator.d.ts", lib_es2015_generator_d_ts);
fsMap.set("/lib.es2015.iterable.d.ts", lib_es2015_iterable_d_ts);
fsMap.set("/lib.es2015.promise.d.ts", lib_es2015_promise_d_ts);
fsMap.set("/lib.es2015.proxy.d.ts", lib_es2015_proxy_d_ts);
fsMap.set("/lib.es2015.reflect.d.ts", lib_es2015_reflect_d_ts);
fsMap.set("/lib.es2015.symbol.d.ts", lib_es2015_symbol_d_ts);
fsMap.set(
  "/lib.es2015.symbol.wellknown.d.ts",
  lib_es2015_symbol_wellknown_d_ts
);

const createDefaultMap = () => new Map(fsMap);
export { createDefaultMap };
