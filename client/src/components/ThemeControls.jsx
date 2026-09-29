import { Box, FormControl, MenuItem, Select, Switch, Typography } from "@mui/material";
import { useAppTheme } from "../theme/ThemeContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function ThemeControls() {
    const {
        mode, themeName, toggleMode, changeTheme
    } = useAppTheme();
    return (
        <Box
            sx={{
                display: "flex",
                alignment: "center",
                gap: 1
            }}
            >
                
                {/*light/dark switch*/}
                <WbSunnyIcon />
                <Switch
                    checked={mode==="dark"}
                    onChange={toggleMode}
                    inputProps={{
                        "aria-label" : "Toggle dark mode"
                    }}
                    />
                <DarkModeIcon />

                {/*theme selector */}
                <FormControl
                    size="small"
                    sx={{
                        minWidth:110
                    }}
                    >
                        <Select
                            value={themeName}
                            onChange={(event) => 
                                changeTheme(event.target.value)
                            }
                            aria-label="Choose theme"
                            >
                                <MenuItem value = "ocean">Ocean</MenuItem>
                                <MenuItem value = "violet">Violet</MenuItem>
                                <MenuItem value = "forest">Forest</MenuItem>
                            </Select>
                    </FormControl>
            </Box>
    );
}

export default ThemeControls;