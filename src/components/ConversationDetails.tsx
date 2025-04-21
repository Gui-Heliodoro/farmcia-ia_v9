import { useState } from 'react';
import { X, Send, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Conversation } from '../types';
import { useAuthStore } from '../store/authStore';
import { useConversationStore } from '../store/conversationStore';

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();
  const { assignConversation, updateConversationStatus } = useConversationStore();
  
  // Mock messages for this conversation (would come from API)
  const [messages] = useState([
    {
      id: '1',
      sender: 'customer',
      text: 'Olá, gostaria de saber se vocês têm o medicamento Dipirona em estoque.',
      timestamp: new Date(conversation.last_message_time).getTime() - 1000 * 60 * 5,
    },
    {
      id: '2',
      sender: 'ai',
      text: 'Olá! Sim, temos Dipirona em estoque. Posso verificar as opções disponíveis. Você prefere em comprimido, gotas ou injetável?',
      timestamp: new Date(conversation.last_message_time).getTime() - 1000 * 60 * 4,
    },
    {
      id: '3',
      sender: 'customer',
      text: 'Preciso de comprimidos. Qual o preço da caixa com 20 comprimidos?',
      timestamp: new Date(conversation.last_message_time).getTime() - 1000 * 60 * 3,
    },
    {
      id: '4',
      sender: 'ai',
      text: conversation.last_message,
      timestamp: new Date(conversation.last_message_time).getTime(),
    },
  ]);
  
  const formatMessageTime = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm', { locale: ptBR });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Here you would integrate with your messaging API
    console.log('Sending message:', message);
    
    // Clear the input
    setMessage('');
  };
  
  const handleTakeOver = async () => {
    if (!user) return;
    
    // Assign conversation to current user
    await assignConversation(conversation.id, user.id);
    
    // Update status to waiting
    await updateConversationStatus(conversation.id, 'waiting');
    
    onClose();
  };
  
  const isAssigned = conversation.assigned_to === user?.id;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 mr-3">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{conversation.customer_name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Phone size={14} className="mr-1" />
                <span>{conversation.customer_phone}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'customer' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'customer'
                      ? 'bg-white border border-gray-200'
                      : msg.sender === 'ai'
                      ? 'bg-secondary-100 text-secondary-800'
                      : 'bg-primary-100 text-primary-800'
                  }`}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t">
          {conversation.status === 'ongoing' && !isAssigned ? (
            <button
              onClick={handleTakeOver}
              className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-medium transition"
            >
              Assumir Conversa
            </button>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-md p-2 transition"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationDetails;