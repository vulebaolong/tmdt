import { effectText } from "@/helpers/motion.helper";
import { Badge as BadgeMantine, BadgeProps } from "@mantine/core";
import { forwardRef } from "react";

type TProps = {
   user?: any | null;
} & BadgeProps;

const Badge = forwardRef<HTMLDivElement, TProps & React.ComponentPropsWithoutRef<"div">>(({ user, ...props }, ref) => {
   return (
      <BadgeMantine {...props} ref={ref} variant="outline" color={user?.roleId === 1 ? `red` : `blue`}>
         {effectText(user?.Roles.name || ``)}
      </BadgeMantine>
   );
});

Badge.displayName = "Avatar";

export default Badge;
