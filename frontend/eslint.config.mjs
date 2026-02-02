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
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Ngăn chặn việc import xuyên thấu vào nội bộ feature
              // Ví dụ: import X from '@/features/auth/components/LoginForm' là SAI
              group: ["@/features/*/**"],
              message:
                "⚠️ VI PHẠM KIẾN TRÚC: Không được import trực tiếp từ thư mục con của một feature. Hãy export nó qua '@/features/feature-name/index.ts' và import từ đó.",
            },
            {
              // Ngăn chặn việc các Feature import chéo file nội bộ của nhau
              group: ["../**/features/*/**"],
              message:
                "⚠️ VI PHẠM KIẾN TRÚC: Các feature chỉ được giao tiếp qua cổng Public API (index.ts).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
