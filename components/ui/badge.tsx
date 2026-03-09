import * as React from "react";

import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase",
      className,
    )}
    {...props}
  />
));

Badge.displayName = "Badge";

export { Badge };
