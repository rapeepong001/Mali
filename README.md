# 🌐 Mali OpenAI Proxy Server

This is a secure Node.js Express proxy for connecting your AI Friend WebApp to OpenAI API **without exposing your API key**.

## 🔧 Setup

1. Install dependencies:

```
npm install
```

2. Create a `.env` file:

```
OPENAI_API_KEY=sk-xxxxx...
```

3. Start server:

```
npm start
```

Server will run on: `http://localhost:3000/api/chat`

## 📡 Usage

Frontend should `POST` JSON:

```json
{ "prompt": "คุณชื่ออะไร?" }
```

It will return:

```json
{ "reply": "ฉันชื่อ..." }
```

---
Mali-secure and sweet 💖

<!-- Deploy trigger: touched README to force Railway rebuild -->

## Adding a site logo

To show a logo on every page, copy your logo file to `public/images/Logo.png`.
The pages will load `/images/Logo.png` and hide the image if it is missing. If you want me to add the file for you, upload `Logo.png` here and I will place it in `public/images/`.