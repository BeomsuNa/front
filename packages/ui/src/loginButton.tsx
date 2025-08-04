import React from "react";
import styled from "styled-components";

const StyledLoginButton = styled.button`
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Icon = styled.span`
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
`;

interface LoginButtonProps {
  onClick?: () => void;
  text?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  text = "Login",
}) => (
  <StyledLoginButton onClick={onClick}>
    <Icon />
    {text}
  </StyledLoginButton>
);