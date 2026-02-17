/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use ActivatedRoute to get pratica ID from URL params
 * - Inject PraticaService to fetch pratica data
 * - Use signals for reactive state:
 *   - pratica = signal<Pratica | null>(null)
 *   - loading = signal<boolean>(true)
 *   - showComunicazioneDialog = signal<boolean>(false)
 * - Implement navigation back to dashboard
 * - Handle state updates with optimistic UI
 */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Car, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Download,
  Bell,
  LogOut
} from 'lucide-react';
import { praticheMock, Pratica, getStatoLabel, getStatoColor } from '../data/mockData';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { notificationService } from '../services/notificationService';

export function DettaglioPratica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pratica, setPratica] = useState<Pratica | null>(null);
  const [showComunicazione, setShowComunicazione] = useState(false);
  const [messaggioCliente, setMessaggioCliente] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // In produzione: fetch from service
    const found = praticheMock.find(p => p.id === id);
    setPratica(found || null);
    
    const unsubscribe = notificationService.subscribe(setNotificationCount);
    return () => unsubscribe();
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleNotifiche = () => {
    navigate('/notifiche');
  };

  const handleCambioStato = (nuovoStato: Pratica['stato']) => {
    if (pratica) {
      setPratica({ ...pratica, stato: nuovoStato });
      toast.success(`Stato aggiornato a: ${getStatoLabel(nuovoStato)}`);
    }
  };

  const handleInviaComunicazione = () => {
    if (!messaggioCliente.trim()) {
      toast.error('Inserisci un messaggio');
      return;
    }
    toast.success('Comunicazione inviata al cliente');
    setMessaggioCliente('');
    setShowComunicazione(false);
  };

  if (!pratica) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500 mb-2">Pratica non trovata</p>
            <Button onClick={handleBack} className="mt-4">
              Torna alla Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatoSuccessivo = (statoCorrente: Pratica['stato']): Pratica['stato'] | null => {
    const flusso: Pratica['stato'][] = ['non_assegnata', 'in_attesa', 'in_lavorazione', 'in_attesa_riconsegna', 'completata'];
    const index = flusso.indexOf(statoCorrente);
    return index < flusso.length - 1 ? flusso[index + 1] : null;
  };

  const statoSuccessivo = getStatoSuccessivo(pratica.stato);

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
                <h1 className="text-3xl text-white">Dettaglio Pratica</h1>
                <p className="text-[#EBF4F6] mt-1">{pratica.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Campanellina Notifiche */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotifiche}
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna Sinistra - Informazioni Principali */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stato e Azioni */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Stato Pratica</span>
                  <Badge className={getStatoColor(pratica.stato)}>
                    {getStatoLabel(pratica.stato)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    {statoSuccessivo && (
                      <Button
                        onClick={() => handleCambioStato(statoSuccessivo)}
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Passa a: {getStatoLabel(statoSuccessivo)}
                      </Button>
                    )}
                    {pratica.stato === 'completata' && (
                      <Button className="flex-1" variant="outline" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Pratica Completata
                      </Button>
                    )}
                  </div>
                  
                  {pratica.stato !== 'completata' && (
                    <Button
                      variant="outline"
                      onClick={() => setShowComunicazione(!showComunicazione)}
                      className="w-full"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {showComunicazione ? 'Nascondi' : 'Comunica con'} il Cliente
                    </Button>
                  )}
                </div>

                {/* Form Comunicazione */}
                {showComunicazione && (
                  <div className="mt-4 p-4 bg-[#EBF4F6] rounded-lg space-y-3">
                    <label className="block text-sm font-semibold text-[#061E29]">
                      Messaggio per il cliente
                    </label>
                    <Textarea
                      value={messaggioCliente}
                      onChange={(e) => setMessaggioCliente(e.target.value)}
                      placeholder="Es: Il veicolo è pronto per la riconsegna. Può passare a ritirarlo dal lunedì al venerdì dalle 9:00 alle 18:00."
                      rows={4}
                      className="bg-white"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleInviaComunicazione} className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Invia Email
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowComunicazione(false)}
                        className="flex-1"
                      >
                        Annulla
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informazioni Veicolo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#088395]" />
                  Informazioni Veicolo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Targa</p>
                    <p className="font-semibold text-lg">{pratica.targa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-semibold">{pratica.marca}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Modello</p>
                    <p className="font-semibold">{pratica.modello}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data Arrivo</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#7AB2B2]" />
                      {new Date(pratica.dataArrivo).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informazioni Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#088395]" />
                  Informazioni Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold">{pratica.cliente}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${pratica.telefono}`} className="text-[#088395] hover:underline">
                      {pratica.telefono}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${pratica.email}`} className="text-[#088395] hover:underline">
                      {pratica.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dettagli Riparazione */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#088395]" />
                  Dettagli Riparazione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Descrizione Danni</p>
                    <p className="text-sm bg-[#EBF4F6] p-3 rounded">
                      {pratica.descrizione || 'Nessuna descrizione disponibile'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Perito Assicurativo</p>
                      <p className="font-semibold">{pratica.perito}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Compagnia</p>
                      <p className="font-semibold">{pratica.compagnia}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonna Destra - Preventivo e Timeline */}
          <div className="space-y-6">
            {/* Preventivo */}
            <Card className="border-2 border-[#088395]">
              <CardHeader className="bg-[#EBF4F6]">
                <CardTitle className="text-[#088395] flex items-center justify-between">
                  <span>Preventivo</span>
                  <FileText className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Importo Totale</span>
                    <span className="text-2xl font-bold text-[#088395]">
                      €{pratica.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">ID Preventivo</span>
                    <span className="font-mono text-xs">{pratica.preventivo.id}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Scarica PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Stati */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#088395]" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stato: 'non_assegnata', label: 'Ricevuta' },
                    { stato: 'in_attesa', label: 'Assegnata' },
                    { stato: 'in_lavorazione', label: 'In Lavorazione' },
                    { stato: 'in_attesa_riconsegna', label: 'Pronta' },
                    { stato: 'completata', label: 'Completata' },
                  ].map((item, index) => {
                    const flusso: Pratica['stato'][] = ['non_assegnata', 'in_attesa', 'in_lavorazione', 'in_attesa_riconsegna', 'completata'];
                    const currentIndex = flusso.indexOf(pratica.stato);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={item.stato} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-[#088395] text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`font-semibold ${isCurrent ? 'text-[#088395]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                            {item.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-gray-500 mt-1">
                              Stato attuale
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}