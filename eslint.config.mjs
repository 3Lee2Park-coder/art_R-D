import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

eslintConfig.push({
  rules: {
    "@next/next/no-img-element": "off",
    // 프로토타입이 localStorage/sessionStorage를 effect에서 읽어 state로 올리는 패턴을 씀.
    // React 19 eslint 플러그인의 신규 규칙은 이 hydration 패턴을 전부 오류로 본다.
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/purity": "off",
    "react-hooks/refs": "off",
  },
});

export default eslintConfig;
