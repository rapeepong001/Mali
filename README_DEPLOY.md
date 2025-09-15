Ready to deploy - instructions

Docker (recommended):

1. Build image:

   docker build -t mali-proxy:latest .

2. Run container (pass env):

   docker run -e OPENAI_API_KEY=sk-... -p 3000:3000 mali-proxy:latest

Heroku:

1. Login and create app:

   heroku create your-app-name

2. Set config var:

   heroku config:set OPENAI_API_KEY=sk-...

3. Push (if using Heroku Git):

   git push heroku main

4. Scale web:

   heroku ps:scale web=1

Notes:
- Ensure your .env is not committed (it's in .dockerignore and you should not push it).
- Use a real OpenAI API key with proper permissions.
