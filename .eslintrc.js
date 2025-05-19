module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "prettier/prettier": "warn",
    "react/react-in-jsx-scope": "off", // React 17+ 不需要 import React
    // 可以根據你的需求添加其他規則
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
