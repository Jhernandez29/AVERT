/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spinAnimation = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const turbineBaseStyles = css`
  fill: #0092cc;
`;

const turbineBladesStyles = css`
  transform-origin: 88px 86.78px; /* center of blades */
  animation: ${spinAnimation} 2s linear infinite;

  path {
    fill: #00bee6;
  }

  circle {
    fill: none;
  }
`;

const turbineCapStyles = css`
  fill: #03d5e5;
`;

export function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="176"
      height="256"
      viewBox="0 0 176 256"
    >
      <title>Wind Turbine</title>
      <path
        css={turbineBaseStyles}
        d="M93.46,246c0,1.1-2.44,2-5.46,2s-5.46-.9-5.46-2L84,86.78h8Z"
      />
      <g css={turbineBladesStyles}>
        <path d="M88,86.26c-4.94,0-4-15.32-4-34.24S85.74,8,88,8s4,25.12,4,44S92.94,86.26,88,86.26Z" />
        <path d="M88,86.26c2.48,4.28-11.32,11-27.7,20.5s-39,20.5-40,18.62S40,109.44,56.4,100,85.52,82,88,86.26Z" />
        <path d="M88,86.26C90.48,82,103.22,90.54,119.6,100s37.26,23.52,36.18,25.38S132,116.2,115.7,106.76,85.52,90.54,88,86.26Z" />
        <circle cx="88" cy="86.26" r="78.26" />
      </g>
      <circle css={turbineCapStyles} cx="88" cy="86.78" r="7.58" />
    </svg>
  );
}

const heartAnimation = keyframes`
  to {
  stroke-dashoffset: -500;
  }
`;

const heartShapeStyles = css`
  fill: #662f8d;
`;

const heartPathStyles = css`
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: ${heartAnimation} 3.5s linear infinite;
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 7;
  stroke-miterlimit: 10;
`;

export function HeartShapeIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="176"
      height="256"
      viewBox="0 0 200 200"
    >
      <title>Heart Shape</title>
      <g>
        <path
          css={heartShapeStyles}
          d="M183.3,66.7c0,31.9-27.1,51.5-46.7,70c-13.3,12.3-25.5,25.7-36.7,40
              c-11.1-14.3-23.4-27.7-36.7-40c-19.6-18.5-46.7-38.1-46.7-70c0-23.9,19.4-43.3,43.3-43.3c17.5,0,33.3,10.5,40,26.7
              c9.2-22.1,34.6-32.5,56.7-23.3C172.8,33.4,183.3,49.2,183.3,66.7z"
        />
        <path
          css={heartPathStyles}
          d="M0,100h57.2c0.7,0,1.4-0.4,1.7-1l4.9-9.7c0.4-0.9,1.5-1.2,2.4-0.8c0.3,0.1,0.5,0.3,0.7,0.6
              l9.3,12.8c0.6,0.8,1.7,1,2.5,0.4c0.4-0.3,0.6-0.6,0.7-1l8.4-37.4c0.2-1,1.2-1.6,2.1-1.4c0.8,0.2,1.3,0.8,1.4,1.6l7.7,70.4
              c0.1,1,1,1.7,2,1.6c0.8-0.1,1.4-0.6,1.6-1.4l7.5-33.1c0.2-1,1.2-1.6,2.1-1.4c0.5,0.1,0.9,0.4,1.1,0.8l2.4,3.6
              c0.5,0.8,1.6,1,2.5,0.5c0.3-0.2,0.6-0.5,0.7-0.9l3.6-9.8c0.4-0.9,1.4-1.3,2.3-0.9c0.5,0.2,0.8,0.6,1,1.1l3.1,11
              c0.3,1,1.2,1.5,2.2,1.3c0.5-0.1,0.9-0.5,1.2-1l3.7-7.4c0.4-0.9,1.5-1.2,2.4-0.8c0.1,0,0.1,0.1,0.2,0.1l2.9,1.9
              c0.3,0.2,0.6,0.3,1,0.3H200"
        />
      </g>
    </svg>
  );
}

const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const iconsContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  height: 50%;
`;

const dotContainer = css`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 10px 0; /* Space between dots and text */
`;

const dotLoading = keyframes`
  0%, 20% { opacity: 0.2; }
  40% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Dot = styled.div<{ delay: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: black;
  animation: ${dotLoading} 5s infinite ease-in-out;
  animation-delay: ${(props) => props.delay};
`;

// AVERT’s spinning wind turbine and COBRA’s beating heart
export function CommunicatingIcons() {
  return (
    <div css={container}>
      <div css={iconsContainer}>
        <LoadingIcon />
        <div css={dotContainer}>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </div>
        <HeartShapeIcon />
      </div>
      <div className="usa-alert usa-alert--slim usa-alert--info">
        <div className="usa-alert__body">
          <p className="usa-alert__text">
            Sending data to COBRA. This may take a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
