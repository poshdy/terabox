import { Separator } from "../ui/separator";
import { Toggle } from "../ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Toggle onClick={() => setTheme("dark")}>
        <Moon />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle onClick={() => setTheme("light")}>
        <Sun />
      </Toggle>
    </div>
  );
};
