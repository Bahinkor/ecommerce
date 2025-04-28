import { init } from "@fullstacksjs/eslint-config";

export default init({
  node: true,
  rules: {
    "perfectionist/sort-classes": "off",
    "import/no-cycle": "off",
  },
}); // enable eslint configuration
