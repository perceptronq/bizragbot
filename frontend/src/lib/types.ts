export interface User {
    id: string;
    email?: string;
  }
  
  export interface ChatMessage {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
  }
  