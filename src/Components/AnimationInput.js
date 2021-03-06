// Import Modules
import React, { useEffect } from "react";
import styled from "styled-components";
import Input from "./Input";
import Label from "./Label";
import { useState } from "react";

// Styled Components
const Container = styled.div`
  position: relative;
  margin-top: 20px;
`;

const AniInput = styled(Input)`
  ${props => {
    if (props.post) {
      return props.ani ? "border-bottom: 1.2px solid #f3aa42 !important" : "";
    }
  }}
`;

const AniLabel = styled(Label)`
  position: absolute;
  ${props => {
    if (props.ani) {
      return `
      left: -3px;
      top: -15px;
      font-size: ${props.aniAfter};
      font-weight: 600;
      color: ${props.theme.mainColor};
      `;
    } else {
      return `
      left: 12px;
      top: 10px;
      font-size: ${props.aniBefore};
      font-weight: 300;
      color: ${props.theme.blackColor};
      `;
    }
  }}
  pointer-events: none;
  transition: ${props => props.theme.transitionOpt};
  /* Focus Animation */
  ${AniInput}:focus ~ & {
    left: -3px !important;
    top: -15px;
    font-size: ${props => props.aniAfter};
    font-weight: 600;
    color: ${props => props.theme.mainColor};
  }
`;

// Render
const AnimationInput = ({
  id,
  placeholder,
  required = true,
  value,
  onChange,
  type = "text",
  labelText,
  disabled,
  post = false,
  className,
  aniBefore = "10px",
  aniAfter = "12px"
}) => {
  const [ani, setAni] = useState(false);

  useEffect(() => {
    if (value !== "") {
      setAni(true);
    } else {
      setAni(false);
    }
  }, [value]);

  return (
    <Container className={className}>
      <AniInput
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        type={type}
        disabled={disabled}
        ani={ani}
        post={post}
      />
      <AniLabel
        htmlFor={id}
        labelText={labelText}
        ani={ani}
        aniBefore={aniBefore}
        aniAfter={aniAfter}
      />
    </Container>
  );
};

export default AnimationInput;
