# AI-Powered Interview Assistant

An AI-powered interview simulation app built with ***React + TypeScript + Redux + Tailwind CSS.***
This project was created as part of a random Internship Assignment. The app allows candidates to take a timed interview with AI-generated questions, while interviewers can view candidate results, scores, and insights in a dashboard.

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS, Framer Motion, Lucide Icons
- State Management: Redux Toolkit + redux-persist
- PDF Parsing: pdfjs-dist (for extracting resume details)
- Mock AI: Local JSON + Mock generators
- Pluggable AI service layer (can integrate with OpenAI/LLM APIs)

1. Clone the repo
```
git clone https://github.com/YOUR-USERNAME/ai-interview-assistant.git
cd ai-interview-assistant
```
3. Install dependencies
```
npm install
```
4. Run the app
```
npm run dev
```
5. Build for production
```
npm run build
```

Environment Variables, In .env you can configure mock vs real AI usage:
```
VITE_USE_MOCK_AI=true
```
When set to true, the app uses mock AI data.
You can later hook in real AI APIs by editing features/ai/aiService.ts.

## Screenshots
***Interviewee Chat*** (Candidate answering AI questions in chat UI)
<img width="843" height="790" alt="Screenshot 2025-10-04 at 1 41 51 AM" src="https://github.com/user-attachments/assets/b856b921-dd74-47b8-bfa8-9df0c805d7c9" />

***Interviewer Dashboard*** (Metrics, insights, and candidate management)
<img width="1512" height="731" alt="Screenshot 2025-10-04 at 1 39 52 AM" src="https://github.com/user-attachments/assets/26b7a951-20d3-42b4-9f23-603153aa2e8a" />

Thank you this was made by Trixie and Happy Coding!
