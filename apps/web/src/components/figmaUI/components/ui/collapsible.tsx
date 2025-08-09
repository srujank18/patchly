"use client";

import * as React from "react";

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Collapsible({ open, onOpenChange, children }: CollapsibleProps) {
  return <div data-slot="collapsible">{children}</div>;
}

interface CollapsibleTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function CollapsibleTrigger({ asChild, children, onClick, className }: CollapsibleTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick, className });
  }
  return (
    <button data-slot="collapsible-trigger" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  return (
    <div data-slot="collapsible-content" className={className}>
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
