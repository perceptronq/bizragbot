import { supabase } from './supabaseClient';
import { ChatMessage } from './types';

export const saveChatMessage = async (message: string): Promise<{ data: ChatMessage | null; error: string | null }> => {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('chats')
    .insert([{ user_id: user.data?.user?.id, message }]);

  return { data: data ? data[0] : null, error: error ? error.message : null };
};

export const fetchChatHistory = async (): Promise<{ data: ChatMessage[] | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data?.user?.id)
    .order('created_at', { ascending: false });

  return { data, error: error ? error.message : null };
};
