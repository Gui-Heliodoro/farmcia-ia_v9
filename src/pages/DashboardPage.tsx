import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useConversationStore } from '../store/conversationStore';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import MetricsDashboard from '../components/MetricsDashboard';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { fetchConversations, setupRealtimeSubscription } = useConversationStore();
  
  // Fetch conversations and setup realtime updates
  useEffect(() => {
    fetchConversations();
    
    // Subscribe to realtime updates
    const unsubscribe = setupRealtimeSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [fetchConversations, setupRealtimeSubscription]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bem-vindo(a), {user?.name}
        </h1>
        
        {user?.role === 'management' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Métricas de Desempenho</h2>
            <MetricsDashboard />
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerenciamento de Conversas</h2>
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;