OAuth setup to run Calendar APIs in customer accounts:
1. Create a new project on google cloud 
2. Check the header bar to make sure you are going to perform the next steps in the correct project
3. "APIs & Services" > "Google Calendar API" > enable
4. "APIs & Services" > "OAuth Consent Screen"
    - external
    - app name, support email, dev contact info
    - scopes: add "https://www.googleapis.com/auth/calendar"
    - test users: add emails that you plan to test with
5. Create "OAuth Client ID"
    - Application Type: Web application
    - Redirect URI: http://localhost:3000/oauth2callback (can add prod uris later. GCP can keep multiple uris)
    - Save
    - save/download the client_id and client_secret


