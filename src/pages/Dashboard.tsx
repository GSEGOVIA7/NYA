import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, UserPlus, Clock } from 'lucide-react';
import type { Client } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clientsRef = collection(db, 'clients');
        
        // Get recent clients
        const recentQuery = query(clientsRef, orderBy('createdAt', 'desc'), limit(5));
        const recentSnapshot = await getDocs(recentQuery);
        const recentData = recentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[];
        
        setRecentClients(recentData);
        setTotalClients(recentSnapshot.size);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card - Total Clients */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Clientes
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {totalClients}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Card - Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Última Actividad
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {recentClients[0]?.createdAt ? 
                        format(recentClients[0].createdAt.toDate(), "d 'de' MMMM, HH:mm", { locale: es }) :
                        'Sin actividad reciente'
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clients Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Clientes Recientes</h2>
          <a href="/clients/new" className="flex items-center text-sm text-blue-600 hover:text-blue-500">
            <UserPlus className="h-5 w-5 mr-1" />
            Nuevo Cliente
          </a>
        </div>
        
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentClients.map((client) => (
              <li key={client.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-600 truncate">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {client.identificationNumber}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {client.email}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Creado el {format(client.createdAt.toDate(), "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}