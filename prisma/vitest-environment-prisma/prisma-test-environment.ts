import { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  async setup() {
    console.log("xablau");

    return {
      teardown: () => {
        console.log("Executed-");
      },
    };
  },
  transformMode: "ssr",
};
