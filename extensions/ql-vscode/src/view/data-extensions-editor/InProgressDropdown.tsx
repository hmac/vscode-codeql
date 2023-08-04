import * as React from "react";
import { Dropdown } from "../common/Dropdown";
import styled from "styled-components";

const StyledDropdown = styled(Dropdown)`
  font-style: italic;
`;

export const InProgressDropdown = () => {
  const options: Array<{ label: string; value: string }> = [
    {
      label: "Thinking...",
      value: "Thinking...",
    },
  ];
  const noop = () => {
    // Do nothing
  };

  return (
    <StyledDropdown
      value="Thinking..."
      options={options}
      disabled={false}
      onChange={noop}
    />
  );
};
