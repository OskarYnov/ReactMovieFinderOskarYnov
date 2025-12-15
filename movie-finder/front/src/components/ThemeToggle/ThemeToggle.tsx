import { useTheme } from "../../Providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import "./theme-toggle.css";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle" onClick={toggleTheme}>
            <div className={`theme-toggle__slider ${theme}`}>
                <Sun className="theme-toggle__icon" size={16} />
                <Moon className="theme-toggle__icon" size={16} />
            </div>
        </div>
    );
}
