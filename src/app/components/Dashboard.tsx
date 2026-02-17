import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Car, Calendar, User, Check, X, Bell, LogOut } from 'lucide-react';
import { praticheMock, Pratica, getStatoLabel, getStatoColor } from '../data/mockData';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { notificationService, Notification } from '../services/notificationService';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStato, setFiltroStato] = useState<string>('tutti');
  const [filtroAssegnazione, setFiltroAssegnazione] = useState<'tutte' | 'assegnate' | 'non_assegnate'>('assegnate');
  const [pratiche, setPratiche] = useState(praticheMock);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Sottoscrizione alle notifiche
    const unsubscribe = notificationService.subscribe(setNotificationCount);
    const unsubscribeNotifications = notificationService.subscribeNotifications(setNotifications);
    
    return () => {
      unsubscribe();
      unsubscribeNotifications();
    };
  }, []);

  const handleAccettaPratica = (praticaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPratiche(pratiche.map(p => 
      p.id === praticaId ? { ...p, assegnata: true } : p
    ));
    notificationService.decrementCount();
    toast.success('Pratica accettata e assegnata all\'officina');
  };

  const handleRifiutaPratica = (praticaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPratiche(pratiche.filter(p => p.id !== praticaId));
    notificationService.decrementCount();
    toast.success('Pratica rifiutata');
  };

  const handleNotificationClick = (notification: Notification) => {
    notificationService.markAsRead(notification.id);
    if (notification.praticaId) {
      setFiltroAssegnazione('non_assegnate');
    }
  };

  const handleClearNotifications = () => {
    notificationService.clearAll();
  };

  const handleLogout = () => {
    toast.success('Logout effettuato');
    navigate('/');
  };

  const handlePraticaClick = (pratica: Pratica) => {
    navigate(`/pratica/${pratica.id}`);
  };

  const handleCambioStato = (praticaId: string, nuovoStato: Pratica['stato']) => {
    setPratiche(pratiche.map(p => 
      p.id === praticaId ? { ...p, stato: nuovoStato } : p
    ));
    toast.success('Stato pratica aggiornato con successo');
  };

  // Filtro pratiche
  const praticheFiltrate = pratiche.filter(pratica => {
    const matchSearch = 
      pratica.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pratica.targa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pratica.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStato = filtroStato === 'tutti' || pratica.stato === filtroStato;
    
    const matchAssegnazione = 
      filtroAssegnazione === 'tutte' ||
      (filtroAssegnazione === 'assegnate' && pratica.assegnata) ||
      (filtroAssegnazione === 'non_assegnate' && !pratica.assegnata);
    
    return matchSearch && matchStato && matchAssegnazione;
  });

  // Statistiche
  const stats = {
    totale: pratiche.filter(p => p.assegnata).length,
    in_attesa: pratiche.filter(p => p.stato === 'in_attesa' && p.assegnata).length,
    in_lavorazione: pratiche.filter(p => p.stato === 'in_lavorazione' && p.assegnata).length,
    in_attesa_riconsegna: pratiche.filter(p => p.stato === 'in_attesa_riconsegna' && p.assegnata).length,
    non_assegnate: pratiche.filter(p => !p.assegnata).length,
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-[#088395] border-b border-[#09637E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-white">Dashboard Officina</h1>
              <p className="text-[#EBF4F6] mt-1">Gestione pratiche e riparazioni</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Campanellina Notifiche */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/notifiche')}
                className="relative bg-white/10 hover:bg-white/20 text-white"
                title="Visualizza notifiche"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              <div className="text-right">
                <p className="text-sm text-[#EBF4F6]">Officina Autorizzata</p>
                <p className="text-sm text-white">Martedì, 10 Febbraio 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#10546D]">Totale Pratiche</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-[#088395]">{stats.totale}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#10546D]">In Attesa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-[#5F9598]">{stats.in_attesa}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#10546D]">In Lavorazione</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-[#09637E]">{stats.in_lavorazione}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#10546D]">Pronte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-[#088395]">{stats.in_attesa_riconsegna}</p>
            </CardContent>
          </Card>
        </div>

        {/* Barra ricerca e filtri */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            {/* Filtri Assegnazione */}
            <div className="flex gap-3 pb-4 border-b">
              <Button
                variant={filtroAssegnazione === 'assegnate' ? 'default' : 'outline'}
                onClick={() => setFiltroAssegnazione('assegnate')}
                className="flex-1"
              >
                Assegnate ({stats.totale})
              </Button>
              <Button
                variant={filtroAssegnazione === 'non_assegnate' ? 'default' : 'outline'}
                onClick={() => setFiltroAssegnazione('non_assegnate')}
                className="flex-1"
              >
                Non Assegnate ({stats.non_assegnate})
              </Button>
            </div>

            {/* Ricerca e Filtri Stato */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cerca per numero pratica, targa o cliente..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filtroStato === 'tutti' ? 'default' : 'outline'}
                  onClick={() => setFiltroStato('tutti')}
                >
                  Tutte
                </Button>
                <Button
                  variant={filtroStato === 'in_attesa' ? 'default' : 'outline'}
                  onClick={() => setFiltroStato('in_attesa')}
                >
                  In Attesa
                </Button>
                <Button
                  variant={filtroStato === 'in_lavorazione' ? 'default' : 'outline'}
                  onClick={() => setFiltroStato('in_lavorazione')}
                >
                  In Lavorazione
                </Button>
                <Button
                  variant={filtroStato === 'in_attesa_riconsegna' ? 'default' : 'outline'}
                  onClick={() => setFiltroStato('in_attesa_riconsegna')}
                >
                  Pronte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista Pratiche */}
        <div className="space-y-4">
          <h2 className="text-xl">
            {filtroAssegnazione === 'assegnate' ? 'Pratiche Assegnate' : 'Pratiche Non Assegnate'} ({praticheFiltrate.length})
          </h2>
          
          {praticheFiltrate.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Nessuna pratica trovata</p>
              </CardContent>
            </Card>
          ) : (
            praticheFiltrate.map((pratica) => (
              <Card 
                key={pratica.id} 
                className={`hover:shadow-lg transition-shadow ${pratica.assegnata ? 'cursor-pointer' : ''}`}
                onClick={() => pratica.assegnata && handlePraticaClick(pratica)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg">{pratica.numero}</span>
                        <Badge className={`${getStatoColor(pratica.stato)} border`}>
                          {getStatoLabel(pratica.stato)}
                        </Badge>
                        {!pratica.assegnata && (
                          <Badge className="bg-[#F3F4F4] text-[#10546D] border-[#7AB2B2] border">
                            Da Assegnare
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Veicolo</p>
                            <p>{pratica.veicolo.marca} {pratica.veicolo.modello}</p>
                            <p className="text-gray-500">{pratica.veicolo.targa}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Cliente</p>
                            <p>{pratica.automobilista.nome} {pratica.automobilista.cognome}</p>
                            <p className="text-gray-500">{pratica.automobilista.telefono}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Data Apertura</p>
                            <p>{new Date(pratica.dataApertura).toLocaleDateString('it-IT')}</p>
                            <p className="text-gray-500">Importo: €{pratica.preventivo.importoTotale.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {pratica.assegnata ? (
                        <Button>
                          Visualizza
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => handleAccettaPratica(pratica.id, e)}
                            className="bg-[#088395] hover:bg-[#09637E]"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accetta
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => handleRifiutaPratica(pratica.id, e)}
                            className="border-[#9A6463] text-[#9A6463] hover:bg-[#9A6463] hover:text-white"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rifiuta
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}