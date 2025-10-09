"use client";

import React from "react";

export function withClientWrapper<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  hoc: <T extends object>(component: React.ComponentType<T>) => React.ComponentType<T>
): React.ComponentType<P> {
  const ClientWrapped = hoc<P>(WrappedComponent);
  return ClientWrapped;
}
