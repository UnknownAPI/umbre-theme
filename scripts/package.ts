import { packageVsix } from "@scripts/build/package-vsix.ts";

const vsix = await packageVsix();
console.log(`Packaged ${vsix.pathname}`);
