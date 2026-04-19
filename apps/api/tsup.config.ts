import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  platform: "node",
  bundle: true,
  // Bundle workspace packages inline — elimina dependência de symlinks em produção
  noExternal: ["@dopamind/shared", "@dopamind/science"],
  clean: true,
  outDir: "dist",
  sourcemap: false,
});
