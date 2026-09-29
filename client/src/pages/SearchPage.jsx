import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import ThemeControls from "../components/ThemeControls";

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    function handleSearch(event){
        event.preventDefault();
        const query=searchTerm.trim().toLowerCase();
        if(!query){
            return;
        }
        navigate(`/results?q=${encodeURIComponent(query)}`);
    }
    return(
        <Box
        sx={{
            minHeight: "100vh",
            bgcolor:"background.default",
            color:"text.primary",
            display:"flex",
            flexDirection:"column"
        }}
        >
            {/*Theme controls */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2
                }}
                >
                    <ThemeControls />
                </Box>
            {/*Theme controls */}
            <Box
                sx={{
                    flex:1,
                    display:"flex",
                    alignItems:"center",
                    justifyContent: "center"
                }}
                >
                    <Container maxWidth="md">
                        <Stack
                            alignItems="center"
                            spacing={4}
                            >
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    color="primary"
                                    fontWeight={700}
                                    >
                                        Search Rocket
                                    </Typography>
                                <Box
                                    component="form"
                                    onSubmit={handleSearch}
                                    sx={{
                                        display:"flex",
                                        gap: 1.5,
                                        width: "100%",
                                        maxWidth: 650,
                                        flexDirection:{
                                            xs:"column",
                                            sm:"row"
                                        }
                                    }}
                                    >
                                        <TextField
                                            fullWidth placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(event)=>
                                                setSearchTerm(event.target.value)
                                            }
                                            inputProps={{
                                                "aria-label":"Search query"
                                            }}
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    px: 4,
                                                    textTransform: "none"
                                                }}
                                                >
                                                    Search
                                                </Button>
                                    </Box>
                            </Stack>
                    </Container>
                </Box>
        </Box>
    );
}

export default SearchPage;