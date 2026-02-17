/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Inject NotificationService
 * - Use signals for reactive state:
 *   - notifiche = signal from NotificationService
 *   - filtroTipo = signal<string>('tutte')
 * - Navigate back to dashboard or specific pratica when clicking notification
 */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, BellOff, Check, CheckCheck, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import { notificationService, Notification } from '../services/notificationService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function Notifiche() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'tutte' | 'non_lette'>('tutte');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeNotifications(setNotifications);
    const unsubscribeCount = notificationService.subscribe(setNotificationCount);
    return () => {
      unsubscribe();
      unsubscribeCount();
    };
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleNotificationClick = (notification: Notification) => {
    notificationService.markAsRead(notification.id);
    
    if (notification.praticaId) {
      // Naviga al dettaglio della pratica
      navigate(`/pratica/${notification.praticaId}`);
    } else {
      // Se non c'è una pratica associata, torna alla dashboard
      navigate('/dashboard');
    }
  };

  const handleMarkAllAsRead = () => {
    notificationService.clearAll();
  };

  const notificheFiltrate = filtroTipo === 'tutte' 
    ? notifications 
    : notifications.filter(n => !n.letta);

  const nonLetteCount = notifications.filter(n => !n.letta).length;

  const getNotificationIcon = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'nuova_pratica':
        return <FileText className="h-5 w-5 text-[#088395]" />;
      case 'stato_modificato':
        return <AlertCircle className="h-5 w-5 text-[#09637E]" />;
      case 'messaggio':
        return <MessageSquare className="h-5 w-5 text-[#7AB2B2]" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTipoLabel = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'nuova_pratica':
        return 'Nuova Pratica';
      case 'stato_modificato':
        return 'Stato Modificato';
      case 'messaggio':
        return 'Messaggio';
      default:
        return 'Notifica';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-[#088395] border-b border-[#09637E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl text-white">Notifiche</h1>
                <p className="text-[#EBF4F6] mt-1">
                  {nonLetteCount > 0 
                    ? `${nonLetteCount} ${nonLetteCount === 1 ? 'notifica non letta' : 'notifiche non lette'}`
                    : 'Tutte le notifiche lette'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {nonLetteCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Segna tutte come lette
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtri */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                variant={filtroTipo === 'tutte' ? 'default' : 'outline'}
                onClick={() => setFiltroTipo('tutte')}
                className="flex-1"
              >
                Tutte ({notifications.length})
              </Button>
              <Button
                variant={filtroTipo === 'non_lette' ? 'default' : 'outline'}
                onClick={() => setFiltroTipo('non_lette')}
                className="flex-1"
              >
                Non Lette ({nonLetteCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista Notifiche */}
        <div className="space-y-3">
          {notificheFiltrate.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BellOff className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500 mb-2">
                  {filtroTipo === 'non_lette' ? 'Nessuna notifica non letta' : 'Nessuna notifica'}
                </p>
                <p className="text-sm text-gray-400">
                  {filtroTipo === 'non_lette' 
                    ? 'Tutte le notifiche sono state lette'
                    : 'Le nuove notifiche appariranno qui'}
                </p>
              </CardContent>
            </Card>
          ) : (
            notificheFiltrate.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  !notification.letta 
                    ? 'border-l-4 border-l-[#088395] bg-[#EBF4F6]/30' 
                    : 'border-l-4 border-l-transparent'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icona */}
                    <div className={`p-3 rounded-full ${
                      !notification.letta ? 'bg-[#088395]/10' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>

                    {/* Contenuto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-semibold ${
                            !notification.letta ? 'text-[#088395]' : 'text-gray-700'
                          }`}>
                            {notification.titolo}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-[#7AB2B2] text-[#10546D]"
                          >
                            {getTipoLabel(notification.tipo)}
                          </Badge>
                        </div>
                        {!notification.letta && (
                          <div className="w-3 h-3 bg-[#088395] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className={`text-sm mb-3 ${
                        !notification.letta ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.messaggio}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.data).toLocaleString('it-IT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>

                        {!notification.letta && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              notificationService.markAsRead(notification.id);
                            }}
                            className="text-[#088395] hover:text-[#09637E] h-auto py-1 px-2"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Segna come letta
                          </Button>
                        )}
                      </div>

                      {notification.praticaId && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            ID Pratica: <span className="text-[#088395] font-mono">{notification.praticaId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info */}
        {notificheFiltrate.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Visualizzate {notificheFiltrate.length} {notificheFiltrate.length === 1 ? 'notifica' : 'notifiche'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}