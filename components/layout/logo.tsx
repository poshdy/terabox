import { IconBox } from "@tabler/icons-react";

export const Logo = () => {
  return (
    <header className="flex items-center gap-1">
      <IconBox className="size-6 text-primary" />
      <span className="text-xl font-semibold leading-tight tracking-tighter">
        TeraBox
      </span>
    </header>
  );
};
