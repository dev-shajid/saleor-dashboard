import { createSvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

const NavigationIcon = createSvgIcon(
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM30 16C30 23.732 23.732 30 16 30C8.26801 30 2 23.732 2 16C2 8.26801 8.26801 2 16 2C23.732 2 30 8.26801 30 16ZM23.1271 11.4417C23.7506 9.83112 22.1768 8.24068 20.5597 8.8471L8.83347 13.2444C7.18709 13.8618 7.08139 16.1506 8.66386 16.9171L12.4577 18.7547L14.8987 23.4842C15.6895 25.0163 17.9187 24.8968 18.5411 23.2889L23.1271 11.4417ZM9.53571 15.1171L21.262 10.7198L16.676 22.5669L14.235 17.8374C14.0366 17.4531 13.7189 17.1433 13.3296 16.9548L9.53571 15.1171Z"
    fill="currentColor"
  />,
  "Navigation",
);

export default function Navigation(props: SvgIconProps) {
  return <NavigationIcon {...props} viewBox="0 0 32 32" />;
}