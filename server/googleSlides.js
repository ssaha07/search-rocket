const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(
    process.cwd(),
    "credentials.json"
);

const TOKEN_PATH = path.join(
    process.cwd(),
    "token.json"
);

// Full Slides access
const SCOPES = [
    "https://www.googleapis.com/auth/presentations"
];

let oauth2Client = null;


// Load Google OAuth credentials
function loadCredentials() {

    const credentials = JSON.parse(
        fs.readFileSync(CREDENTIALS_PATH, "utf8")
    );

    const web = credentials.web;

    oauth2Client = new google.auth.OAuth2(
        web.client_id,
        web.client_secret,
        process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/oauth2callback"
        
    );

    return oauth2Client;
}


// Generate Google's authorization URL
function getAuthUrl() {

    if (!oauth2Client) {
        loadCredentials();
    }

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });
}


// Handle Google's callback
async function handleCallback(code) {

    if (!oauth2Client) {
        loadCredentials();
    }

    const { tokens } =
        await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    fs.writeFileSync(
        TOKEN_PATH,
        JSON.stringify(tokens, null, 2)
    );

    return tokens;
}


// Create authenticated Slides client
async function getSlidesClient() {

    if (!oauth2Client) {
        loadCredentials();
    }

    if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error(
            "Google authentication required. Visit /auth/google first."
        );
    }

    const tokens = JSON.parse(
        fs.readFileSync(TOKEN_PATH, "utf8")
    );

    oauth2Client.setCredentials(tokens);

    return google.slides({
        version: "v1",
        auth: oauth2Client
    });
}


// Read a presentation
async function getPresentation(presentationId) {

    const slides = await getSlidesClient();

    const response =
        await slides.presentations.get({
            presentationId
        });

    return response.data;
}

function extractTextFromPresentation(presentation) {

    const documents = [];

    for (let i = 0; i < (presentation.slides || []).length; i++) {

        const slide = presentation.slides[i];

        let text = "";

        for (const element of slide.pageElements || []) {

            if (
                element.shape &&
                element.shape.text &&
                element.shape.text.textElements
            ) {

                for (
                    const textElement
                    of element.shape.text.textElements
                ) {

                    if (textElement.textRun) {
                        text += textElement.textRun.content;
                    }
                }
            }
        }

        documents.push({
            id: slide.objectId,
            title: `Slide ${i + 1}`,
            text: text.trim(),
            url: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit#slide=id.${slide.objectId}`
        });
    }

    return documents;
}

// Export functions
module.exports = {
    getAuthUrl,
    handleCallback,
    getPresentation,
    extractTextFromPresentation
};