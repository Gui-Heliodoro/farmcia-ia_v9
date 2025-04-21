import { useState } from 'react';
import { Clock, User, Phone, MessageSquare } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Conversation } from '../types';
import ConversationDetails from './ConversationDetails';

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }
    
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  return (
    <>
      <div 
        className={`bg-white rounded-md shadow-card hover:shadow-card-hover p-4 cursor-pointer transition ${
          conversation.is_new ? 'ring-2 ring-accent-400' : ''
        }`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800 truncate">
            {conversation.customer_name}
          </h4>
          <div 
            className={`text-xs px-2 py-1 rounded-full ${
              conversation.type === 'vendor' 
                ? 'bg-secondary-100 text-secondary-600' 
                : 'bg-primary-100 text-primary-600'
            }`}
          >
            {conversation.type === 'vendor' ? 'Vendedor' : 'Farmacêutico'}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{conversation.last_message}</p>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          <span>{formatTime(conversation.last_message_time)}</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Phone size={12} className="mr-1" />
            <span>{conversation.customer_phone}</span>
          </div>
          
          {conversation.is_new && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-accent-500 rounded-full animate-pulse-slow">
              Nova
            </span>
          )}
        </div>
      </div>
      
      {showDetails && (
        <ConversationDetails 
          conversation={conversation} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default ConversationCard;