import {createContext, useContext, useMemo, useState } from "react";
import { createTheme, responsiveFontSizes, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();
const palettes = {
    ocean: {
        light: "#2563eb",
        dark: "#60a5fa"
    },
    violet: {
        light: "#7c3aed",
        dark: "#a78bfa"
    },
    forest: {
        light: "#16834b",
        dark: "#4ade80"
    }
};

export function AppThemeProvider({ children }){
    const [mode, setMode] = useState(
        () => localStorage.getItem("theme-mode") || "light"
    );
    const [themeName, setThemeName] = useState(
        () => localStorage.getItem("theme-name") || "ocean"
    );
    const theme = useMemo(() => {
        const primaryColor= palettes[themeName]?.[mode] || palettes.ocean[mode];
        const baseTheme = createTheme({
            palette: {
                mode,

                primary: {
                    main: primaryColor
                },

                background: {
                    default:
                        mode === "light"
                            ? "#f8fafc"
                            : "#0f172a",

                    paper:
                        mode === "light"
                            ? "#ffffff"
                            : "#1e293b"
                },

                text: {
                    primary:
                        mode === "light"
                            ? "#172033"
                            : "#f1f5f9",

                    secondary:
                        mode === "light"
                            ? "#64748b"
                            : "#cbd5e1"
                }
            },

            shape: {
                borderRadius: 12
            },

            typography: {
                fontFamily:
                    "Arial, Helvetica, sans-serif",

                h1: {
                    fontWeight: 700
                },

                h2: {
                    fontWeight: 700
                },

                h3: {
                    fontWeight: 600
                }
            }
        });
        return responsiveFontSizes(baseTheme);
    }, [mode, themeName]);

    function toggleMode() {
        setMode((current) => {
            const next = current === "light" ? "dark" : "light";
            localStorage.setItem("theme-mode",next);
            return next;
        });
    }

        function changeTheme(name){
            setThemeName(name);
            localStorage.setItem("theme-name", name);
        }

        return (
            <ThemeContext.Provider 
                value={{
                    mode,
                    themeName, 
                    toggleMode,
                    changeTheme
                }}
                >
                    <MuiThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                    </MuiThemeProvider>
                </ThemeContext.Provider>
        );
    }


export function useAppTheme() {
    return useContext(ThemeContext);
}
