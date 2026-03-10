import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PlaygroundLayout({ children }: Props) {
  // TODO: if connection is not established, redirect to /new-connection
  return children;
}
