import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Container, Link, Stack, TextField, Typography} from "@mui/material";
import ThemeControls from "../components/ThemeControls";


function ResultsPage() {
    const [searchParams] = useSearchParams();
    const query=searchParams.get("q") || "";
    const [searchTerm, setSearchTerm] = useState(query);
    const [results, setResults]=useState([]);
    const [searchTime, setSearchTime]=useState(0);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
    useEffect(() => {
        async function search() {
            try{
                const response = await fetch(`https://search-rocket.onrender.com/api/search?q=${encodeURIComponent(query)}`);
                const data=await response.json();
                setResults(data.results);
                setSearchTime(data.searchTime);
            }
            catch(error) {
                console.log("Search failed:", error);
                setResults([]);
                setSearchTime(0);
            } finally{setLoading(false);}
        }
        if(query){
            search();
        }
        else{
            setLoading(false);
        }
    }, [query]);  

    function handleSearch(event){
        event.preventDefault();
        const newQuery=searchTerm.trim().toLowerCase();
        if(!newQuery){
            return;
        }
        navigate(`/results?q=${encodeURIComponent(newQuery)}`);
    }

    return (
        <Box
            sx={{
                minHeight:"100vh",
                bgcolor:"background.default",
                color:"text.primary"
            }}
            >
                <Box
                sx={{
                    borderBottom: 1,
                    borderColor:"divider",
                    bgcolor:"background.paper",
                    px:{
                        xs: 2,
                        md: 4
                    },
                    py: 1.5
                }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display:"flex",
                            alignItems:"center",
                            gap:3
                        }}
                        >
                           <Typography
                        variant="h5"
                        color="primary"
                        fontWeight={700}
                        onClick={() => navigate("/")}
                        sx={{
                            cursor: "pointer",
                            flexShrink: 0
                        }}
                    >
                        Search Rocket
                    </Typography> 
                    {/* SearchBar */}
                    <Box
                                    component="form"
                                    onSubmit={handleSearch}
                                    sx={{
                                        display:"flex",
                                        gap: 1,
                                        width: "100%",
                                        maxWidth: 650,
                                    }}
                                    >
                                        <TextField
                                            fullWidth placeholder="Search..."
                                            value={searchTerm}
                                            size="small"
                                            onChange={(event)=>
                                                setSearchTerm(event.target.value)
                                            }
                                    />
                                    {/* Search Button */}
                                    <Button type="submit"
                                            variant="contained"
                                            sx={{
                                                px:3,
                                                textTransform:"none"
                                            }}
                                    >
                                                Search</Button>
                        </Box>
                        <Box sx ={{marginLeft:"auto"}} >
                            <ThemeControls />
                        </Box>
                </Box>
            </Box>
            <Container
                maxWidth={false}
                sx={{
                    width: "100%",
                    maxWidth: 850,
                    ml: {
                        xs: 2,
                        md: 8
                    },
                    mr: 2,
                    py: 3
                }}
            >
                {loading ? (

                    <Typography
                        color="text.secondary"
                    >
                        Searching...
                    </Typography>

                ) : (

                    <>

                        {/* Result count */}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 3
                            }}
                        >
                            {results.length} results found for{" "}
                            <strong>{query}</strong>
                            {" "}({searchTime.toFixed(2)} ms)
                        </Typography>


                        {/* No results */}

                        {results.length === 0 ? (

                            <Typography
                                color="text.secondary"
                            >
                                No results found.
                            </Typography>

                        ) : (

                            <Stack spacing={3}>

                                {results.map((result) => (

                                    <Box
                                        key={result.id}
                                    >

                                        {/* Result title */}

                                        <Link
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="hover"
                                            color="primary"
                                            sx={{
                                                fontSize: "1.2rem",
                                                fontWeight: 600
                                            }}
                                        >
                                            {result.title}
                                        </Link>


                                        {/* URL */}

                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                            sx={{
                                                mt: 0.5,
                                                mb: 0.5,
                                                wordBreak: "break-word"
                                            }}
                                        >
                                            {result.url}
                                        </Typography>


                                        {/* Snippet */}

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {result.text}
                                        </Typography>

                                    </Box>

                                ))}

                            </Stack>

                        )}

                    </>

                )}

            </Container>

        </Box>
    );
}

export default ResultsPage;