import { createStore } from "@stencil/store";

export const { state } = createStore({
  authenticating: true,
  user: undefined,
});