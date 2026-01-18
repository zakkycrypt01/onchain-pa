// RainbowKitProvider tests

import React from "react";
import { render } from "@testing-library/react";
import { RainbowKitProvider } from "../providers/RainbowKitProvider";

describe("RainbowKitProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <RainbowKitProvider>
        <div>Test Content</div>
      </RainbowKitProvider>
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });
});
