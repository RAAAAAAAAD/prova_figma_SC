import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Pratica, StatoVeicolo, getStatoLabel, getStatoColor } from '../data/mockData';
import { toast } from 'sonner';

interface GestioneStatoProps {
  pratica: Pratica;
  onBack: () => void;
  onAggiornato: () => void;
}

export function GestioneStato({ pratica, onBack, onAggiornato }: GestioneStatoProps) {
  const [nuovoStato, setNuovoStato] = useState<StatoVeicolo>(pratica.stato);
  const [nota, setNota] = useState('');
  const [operatore, setOperatore] = useState('');

  // Flusso degli stati
  const flussoDiStato: Record<StatoVeicolo, StatoVeicolo[]> = {
    in_attesa: ['ricevuto'],
    ricevuto: ['in_riparazione'],
    in_riparazione: ['pronto'],
    pronto: ['riconsegnato'],
    riconsegnato: []
  };

  const statiPossibili = flussoDiStato[pratica.stato];

  const handleAggiorna = () => {
    if (nuovoStato === pratica.stato) {
      toast.error('Seleziona un nuovo stato diverso da quello attuale');
      return;
    }

    if (!operatore.trim()) {
      toast.error('Inserisci il nome dell\'operatore');
      return;
    }

    // Simulazione aggiornamento
    toast.success(`Stato aggiornato a: ${getStatoLabel(nuovoStato)}`);
    
    // Simulazione ritardo per effetto realistico
    setTimeout(() => {
      onAggiornato();
    }, 500);
  };

  const getStatoIcon = (stato: StatoVeicolo) => {
    switch (stato) {
      case 'ricevuto':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'in_riparazione':
        return <Clock className="h-5 w-5" />;
      case 'pronto':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'riconsegnato':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getDescrizioneStato = (stato: StatoVeicolo): string => {
    const descrizioni: Record<StatoVeicolo, string> = {
      in_attesa: 'Il veicolo non è ancora arrivato in officina',
      ricevuto: 'Il veicolo è stato ricevuto ed è in attesa di essere lavorato',
      in_riparazione: 'I lavori di riparazione sono in corso',
      pronto: 'La riparazione è completata, il veicolo è pronto per la riconsegna',
      riconsegnato: 'Il veicolo è stato riconsegnato al cliente'
    };
    return descrizioni[stato];
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-[#088395] border-b border-[#09637E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
              <div>
                <h1 className="text-3xl text-white">Gestione Stato Veicolo</h1>
                <p className="text-[#EBF4F6] mt-1">Pratica {pratica.numero}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stato Attuale */}
            <Card>
              <CardHeader>
                <CardTitle>Stato Attuale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Badge className={`${getStatoColor(pratica.stato)} border text-base py-2 px-4`}>
                    {getStatoLabel(pratica.stato)}
                  </Badge>
                  <p className="text-sm text-gray-600">{getDescrizioneStato(pratica.stato)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Selezione Nuovo Stato */}
            {statiPossibili.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Aggiorna Stato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Seleziona il nuovo stato</Label>
                    <div className="grid gap-3 mt-3">
                      {statiPossibili.map((stato) => (
                        <div
                          key={stato}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            nuovoStato === stato
                              ? 'border-[#088395] bg-[#EBF4F6]'
                              : 'border-[#7AB2B2] hover:border-[#09637E]'
                          }`}
                          onClick={() => setNuovoStato(stato)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              nuovoStato === stato ? 'bg-[#088395] text-white' : 'bg-[#EBF4F6] text-[#10546D]'
                            }`}>
                              {getStatoIcon(stato)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{getStatoLabel(stato)}</p>
                              <p className="text-sm text-gray-600">{getDescrizioneStato(stato)}</p>
                            </div>
                            {nuovoStato === stato && (
                              <CheckCircle2 className="h-5 w-5 text-[#088395]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="operatore">Nome Operatore *</Label>
                    <input
                      id="operatore"
                      type="text"
                      className="w-full mt-2 px-3 py-2 border border-[#7AB2B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088395]"
                      placeholder="Es. Mario Rossi"
                      value={operatore}
                      onChange={(e) => setOperatore(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nota">Note (opzionale)</Label>
                    <Textarea
                      id="nota"
                      className="mt-2"
                      placeholder="Aggiungi eventuali note sull'aggiornamento dello stato..."
                      rows={4}
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1"
                      onClick={handleAggiorna}
                      disabled={nuovoStato === pratica.stato || !operatore.trim()}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Conferma Aggiornamento
                    </Button>
                    <Button variant="outline" onClick={onBack}>
                      Annulla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#088395] mx-auto mb-4" />
                  <h3 className="text-xl mb-2">Pratica Completata</h3>
                  <p className="text-gray-600">
                    Il veicolo è stato riconsegnato. Non sono disponibili ulteriori aggiornamenti di stato.
                  </p>
                  <Button className="mt-6" onClick={onBack}>
                    Torna al Dettaglio
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Flusso Stati */}
            <Card>
              <CardHeader>
                <CardTitle>Flusso Stati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(['in_attesa', 'ricevuto', 'in_riparazione', 'pronto', 'riconsegnato'] as StatoVeicolo[]).map((stato, index) => (
                    <div key={stato}>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs ${
                          stato === pratica.stato
                            ? 'bg-[#088395] text-white'
                            : pratica.cronologia.some(c => c.stato === stato)
                            ? 'bg-[#088395] text-white'
                            : 'bg-[#EBF4F6] text-[#10546D]'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{getStatoLabel(stato)}</p>
                        </div>
                      </div>
                      {index < 4 && (
                        <div className="ml-4 my-1">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info Veicolo */}
            <Card>
              <CardHeader>
                <CardTitle>Veicolo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Targa</span>
                  <span>{pratica.veicolo.targa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Veicolo</span>
                  <span>{pratica.veicolo.marca} {pratica.veicolo.modello}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente</span>
                  <span>{pratica.automobilista.cognome}</span>
                </div>
              </CardContent>
            </Card>

            {/* Alert */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900 mb-1">Attenzione</p>
                    <p className="text-yellow-800">
                      L'aggiornamento dello stato verrà registrato nella cronologia della pratica e non potrà essere annullato.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}