import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';
import { Conversation, ConversationStatus } from '../types';
import ConversationCard from './ConversationCard';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const { conversations, updateConversationStatus, assignConversation } = useConversationStore();
  const { user } = useAuthStore();
  
  const [columns, setColumns] = useState<{
    [key in ConversationStatus]: Conversation[];
  }>({
    ongoing: [],
    waiting: [],
    completed: [],
  });
  
  // Update columns when conversations change
  useEffect(() => {
    // Play notification sound for new conversations
    const newConversation = conversations.find(conv => conv.is_new);
    if (newConversation) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Error playing notification sound:', e));
      
      // Show toast notification
      toast.success('Nova conversa recebida!', {
        icon: '🔔',
      });
    }
    
    // Group conversations by status
    const grouped = conversations.reduce(
      (acc, conversation) => {
        const status = conversation.status as ConversationStatus;
        return {
          ...acc,
          [status]: [...acc[status], conversation],
        };
      },
      { ongoing: [], waiting: [], completed: [] } as { [key in ConversationStatus]: Conversation[] }
    );
    
    setColumns(grouped);
  }, [conversations]);
  
  // Handle drag and drop
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside of any droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Find the conversation that was dragged
    const conversation = conversations.find(c => c.id === draggableId);
    if (!conversation) return;
    
    // Update status and assigned_to if needed
    const newStatus = destination.droppableId as ConversationStatus;
    
    if (newStatus !== conversation.status) {
      // Update the status in the database
      await updateConversationStatus(draggableId, newStatus);
      
      // If moving to 'waiting', assign to current user
      if (newStatus === 'waiting' && user) {
        await assignConversation(draggableId, user.id);
      }
    }
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col lg:flex-row gap-4">
        {Object.entries(columns).map(([status, convs]) => (
          <div key={status} className="flex-1 min-w-0">
            <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center">
              <StatusIcon status={status as ConversationStatus} />
              <span className="ml-2">{getColumnTitle(status as ConversationStatus)}</span>
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {convs.length}
              </span>
            </h3>
            
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-md p-3 min-h-[500px] border border-gray-200"
                >
                  {convs.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                      Sem conversas
                    </div>
                  ) : (
                    convs.map((conversation, index) => (
                      <Draggable
                        key={conversation.id}
                        draggableId={conversation.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-3"
                          >
                            <ConversationCard conversation={conversation} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

// Helper function to get column title
const getColumnTitle = (status: ConversationStatus): string => {
  switch (status) {
    case 'ongoing':
      return 'Conversas em Andamento';
    case 'waiting':
      return 'Aguardando Atendimento';
    case 'completed':
      return 'Conversas Finalizadas';
    default:
      return '';
  }
};

// Status icon component
const StatusIcon = ({ status }: { status: ConversationStatus }) => {
  const colors = {
    ongoing: 'text-blue-500',
    waiting: 'text-orange-500',
    completed: 'text-green-500',
  };
  
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colors[status]}`}>
      <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${colors[status]} opacity-75`}></span>
    </span>
  );
};

export default KanbanBoard;