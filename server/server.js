const express = require("express");
const cors = require("cors");

const {
    getAuthUrl,
    handleCallback,
    getPresentation,
    extractTextFromPresentation
} = require("./googleSlides");

const PRESENTATION_ID = "1dCS3SEkbGgJtFV3933X0uX0gF6r1NDtPg5r7Qcqqzzc";

const app=express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res)=>{
    res.send("Search Rocket backend is working!");
});

app.get("/auth/google", (req, res) =>{
    const authUrl=getAuthUrl();
    res.redirect(authUrl);
});

app.get("/oauth2callback", async(req, res) => {
    try{
        const code = req.query.code;
        if(!code){
            return res.status(400).send(
                "Authorization code missing."
            );
        }
        await handleCallback(code);
        res.send(
            "Google authentication successful!"
        );
    }catch(error){
        console.error(error);
        res.status(500).send(
            "Google authentication failed."
            );
        }
});
app.get("/api/slides/:id", async (req, res) => {
    try {

        const presentation =
            await getPresentation(req.params.id);

        res.json(presentation);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/slides/:id/text", async(req, res) =>{
    try{
        const presentation=await getPresentation(req.params.id);
        const documents=extractTextFromPresentation(presentation);
        res.json({
            title: presentation.title,
            documents: documents
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/search", async(req, res) =>{
    try{
        const startTime=performance.now();

        const query=req.query.q;
        if(!query){
            return res.json({
                results: [],
                searchTime: 0
        });
        }
        const searchTerm=query.trim().toLowerCase();
        const presentation= await getPresentation(PRESENTATION_ID);
        const documents=extractTextFromPresentation(presentation);
        const results=documents.filter((document) =>{
            return (
                document.title.toLowerCase().includes(searchTerm) ||
                document.text.toLowerCase().includes(searchTerm)
            );
        });
        const endTime=performance.now();
        const searchTime = endTime - startTime;
        res.json({
            results: results,
            searchTime: searchTime
    });
    }catch(error){
        console.error(error);
        res.status(500).json({
            error:error.message
        });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>{
    console.log(`Server running on port ${PORT}`);
});

/*const documents = [
        {
    id: 1,
    title: "Introduction to Machine Learning",
    text: "Machine learning is a branch of artificial intelligence that allows computers to learn from data.",
    url: "https://example.com/machine-learning"
        },
        {
    id: 2,
    title: "Supervised Learning Basics",
    text: "Supervised learning uses labelled datasets to train models and make predictions on new data.",
    url: "https://example.com/supervised-learning"
        },
        {
    id: 3,
    title: "Deep Learning Fundamentals",
    text: "Deep learning uses neural networks with multiple layers to learn complex patterns from data.",
    url: "https://example.com/deep-learning"
        },
        {
    id: 4,
    title: "Introduction to Data Science",
    text: "Data science combines statistics, programming and machine learning to extract useful information from data.",
    url: "https://example.com/data-science"
        }
        ];
    app.get("/", (req, res) => {
        res.send("Search Rocket backend is working!");
    });
    app.get("/api/search", (req, res) => {
        const query = req.query.q;
        if(!query){
            return res.json([]);
        } 
        const searchTerm=query.toLowerCase();
        const results=documents.filter(document => {
            return (
                document.title.toLowerCase().includes(searchTerm) ||
                document.text.toLowerCase().includes(searchTerm)
            );
        });
        res.json(results);
    });
    app.listen(5000, () => {
        console.log("Server running on http://localhost:5000");
    });
*/