module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "refactor",
        "style",
        "bugfix",
        "hotfix",
        "fix",
        "build",
        "ci",
        "chore",
        "docs",
        "perf",
        "revert",
        "test",
        "conflict",
      ],
    ],
  },
};
