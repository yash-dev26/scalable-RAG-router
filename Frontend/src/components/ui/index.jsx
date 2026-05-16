import { forwardRef } from "react";

// ── Button ──────────────────────────────────────────────────────────────────
const buttonVariants = {
  default: "bg-white text-zinc-900 hover:bg-zinc-100",
  ghost: "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
  outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 bg-transparent",
  accent: "bg-emerald-500 text-black hover:bg-emerald-400",
  destructive: "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
  icon: "w-9 h-9 p-0 flex items-center justify-center",
};

export const Button = forwardRef(function Button(
  { variant = "default", size = "md", className = "", disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors duration-150 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-40",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
});

// ── Badge ────────────────────────────────────────────────────────────────────
const badgeVariants = {
  default: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  accent: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
  error: "bg-red-500/10 text-red-400 border border-red-500/25",
};

export function Badge({ variant = "default", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase",
        badgeVariants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ className = "", children }) {
  return (
    <div className={["rounded-xl border border-zinc-800 bg-zinc-900", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return (
    <div className={["px-5 pt-4 pb-3", className].join(" ")}>{children}</div>
  );
}

export function CardContent({ className = "", children }) {
  return (
    <div className={["px-5 py-3", className].join(" ")}>{children}</div>
  );
}

export function CardFooter({ className = "", children }) {
  return (
    <div className={["px-5 py-3 border-t border-zinc-800", className].join(" ")}>{children}</div>
  );
}

// ── Separator ────────────────────────────────────────────────────────────────
export function Separator({ orientation = "horizontal", className = "" }) {
  if (orientation === "vertical") {
    return <div className={["w-px bg-zinc-800 self-stretch", className].join(" ")} />;
  }
  return <div className={["h-px w-full bg-zinc-800", className].join(" ")} />;
}

// ── Input ────────────────────────────────────────────────────────────────────
export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={[
        "w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2.5",
        "text-sm text-zinc-100 placeholder-zinc-600",
        "outline-none transition-colors",
        "focus:border-zinc-500",
        "disabled:opacity-40",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

// ── ScrollArea (simple wrapper) ───────────────────────────────────────────────
export function ScrollArea({ className = "", children }) {
  return (
    <div className={["overflow-y-auto scrollbar-thin", className].join(" ")}>
      {children}
    </div>
  );
}

// ── Collapsible ───────────────────────────────────────────────────────────────
import { useState } from "react";

export function Collapsible({ trigger, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer select-none">
        {typeof trigger === "function" ? trigger(open) : trigger}
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}