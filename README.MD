# Bizrag Bot

- Bizrag Bot leverages a RAG framework, where it combines a retrieval mechanism (to pull relevant data or documents) with a generative model, providing answers grounded in accurate, business-specific information.

- This architecture allows it to handle complex queries that require contextual understanding and up-to-date, reliable answers, making it highly suitable for business support, client queries, and decision-making tasks.

### Features

- **Information Retrieval:** Pulls data from a structured source (like a database) or unstructured documents, ensuring answers are fact-based and relevant.

- **Scalable Knowledge Base:** Easily incorporates additional documents, FAQs, or datasets, which makes it adaptable to growing or changing business knowledge.

- **History Management:** Keeps track of chat history, Dashboard provides all of previous interactions.

- **User Authentication:** Allows authenticated sessions, restricting access to sensitive business information only to verified users.

- **Real-time Querying:** Answers questions promptly, suitable for client support or internal team assistance, reducing response time for queries.

### Installation

#### Frontend

```
npm install
```
```
npm run dev
```

#### Backend

```
cd backend && python -m venv venv
```
```
source venv/Scripts/activate
```
```
pip install -r requirements.txt
```
```
python app.py
```

### Login Credentials

Username: <test@bizrag.com>
Password: 123456
