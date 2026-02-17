import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageSquare,
  Send,
  User,
  Car,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Pratica, getStatoLabel } from '../data/mockData';
import { toast } from 'sonner';

interface ContattoClienteProps {
  pratica: Pratica;
  onBack: () => void;
}

export function ContattoCliente({ pratica, onBack }: ContattoClienteProps) {
  const [tipoContatto, setTipoContatto] = useState<'telefono' | 'email' | 'sms'>('telefono');
  const [messaggio, setMessaggio] = useState('');
  const [inviato, setInviato] = useState(false);

  // Template messaggi predefiniti
  const templates = {
    pronto: `Gentile ${pratica.automobilista.nome} ${pratica.automobilista.cognome},\n\nLa informiamo che il suo veicolo ${pratica.veicolo.marca} ${pratica.veicolo.modello} (${pratica.veicolo.targa}) è pronto per la riconsegna.\n\nPuò contattarci per concordare l'orario di ritiro.\n\nCordiali saluti,\nOfficina Autorizzata`,
    aggiornamento: `Gentile ${pratica.automobilista.nome} ${pratica.automobilista.cognome},\n\nLa aggiorniamo sullo stato della pratica ${pratica.numero}.\nVeicolo: ${pratica.veicolo.marca} ${pratica.veicolo.modello} (${pratica.veicolo.targa})\nStato attuale: ${getStatoLabel(pratica.stato)}\n\nRimaniamo a disposizione per ulteriori informazioni.\n\nCordiali saluti,\nOfficina Autorizzata`,
    ritardo: `Gentile ${pratica.automobilista.nome} ${pratica.automobilista.cognome},\n\nLa informiamo che i lavori sul suo veicolo ${pratica.veicolo.marca} ${pratica.veicolo.modello} (${pratica.veicolo.targa}) richiederanno più tempo del previsto.\n\nLa contatteremo appena avremo ulteriori aggiornamenti.\n\nCi scusiamo per il disagio.\n\nCordiali saluti,\nOfficina Autorizzata`
  };

  const handleInvia = () => {
    if (!messaggio.trim()) {
      toast.error('Inserisci un messaggio');
      return;
    }

    // Simulazione invio
    setInviato(true);
    toast.success(`Messaggio inviato via ${tipoContatto === 'telefono' ? 'telefono' : tipoContatto === 'email' ? 'email' : 'SMS'}`);
  };

  const handleUsaTemplate = (template: string) => {
    setMessaggio(template);
  };

  if (inviato) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="bg-[#088395] border-b border-[#09637E]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <h1 className="text-3xl text-white">Contatto Cliente</h1>
                <p className="text-[#EBF4F6] mt-1">Pratica {pratica.numero}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#EBF4F6] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-[#088395]" />
                </div>
              </div>
              <h2 className="text-2xl mb-2">Messaggio Inviato</h2>
              <p className="text-gray-600 mb-6">
                Il cliente {pratica.automobilista.nome} {pratica.automobilista.cognome} è stato contattato con successo.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={onBack}>
                  Torna al Dettaglio
                </Button>
                <Button variant="outline" onClick={() => setInviato(false)}>
                  Invia Altro Messaggio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-[#088395] border-b border-[#09637E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <h1 className="text-3xl text-white">Contatto Cliente</h1>
              <p className="text-[#EBF4F6] mt-1">Pratica {pratica.numero}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selezione Tipo Contatto */}
            <Card>
              <CardHeader>
                <CardTitle>Metodo di Contatto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      tipoContatto === 'telefono'
                        ? 'border-[#088395] bg-[#EBF4F6]'
                        : 'border-[#7AB2B2] hover:border-[#09637E]'
                    }`}
                    onClick={() => setTipoContatto('telefono')}
                  >
                    <Phone className={`h-6 w-6 mx-auto mb-2 ${
                      tipoContatto === 'telefono' ? 'text-[#088395]' : 'text-[#10546D]'
                    }`} />
                    <p className="text-sm">Telefono</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      tipoContatto === 'email'
                        ? 'border-[#088395] bg-[#EBF4F6]'
                        : 'border-[#7AB2B2] hover:border-[#09637E]'
                    }`}
                    onClick={() => setTipoContatto('email')}
                  >
                    <Mail className={`h-6 w-6 mx-auto mb-2 ${
                      tipoContatto === 'email' ? 'text-[#088395]' : 'text-[#10546D]'
                    }`} />
                    <p className="text-sm">Email</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      tipoContatto === 'sms'
                        ? 'border-[#088395] bg-[#EBF4F6]'
                        : 'border-[#7AB2B2] hover:border-[#09637E]'
                    }`}
                    onClick={() => setTipoContatto('sms')}
                  >
                    <MessageSquare className={`h-6 w-6 mx-auto mb-2 ${
                      tipoContatto === 'sms' ? 'text-[#088395]' : 'text-[#10546D]'
                    }`} />
                    <p className="text-sm">SMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Predefiniti */}
            <Card>
              <CardHeader>
                <CardTitle>Template Predefiniti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUsaTemplate(templates.pronto)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Veicolo pronto per riconsegna
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUsaTemplate(templates.aggiornamento)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Aggiornamento stato lavori
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUsaTemplate(templates.ritardo)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Comunicazione ritardo
                </Button>
              </CardContent>
            </Card>

            {/* Messaggio */}
            <Card>
              <CardHeader>
                <CardTitle>Messaggio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="messaggio">
                    Testo del messaggio *
                  </Label>
                  <Textarea
                    id="messaggio"
                    className="mt-2"
                    placeholder="Scrivi il messaggio per il cliente..."
                    rows={12}
                    value={messaggio}
                    onChange={(e) => setMessaggio(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {messaggio.length} caratteri
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleInvia}
                    disabled={!messaggio.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Invia {tipoContatto === 'telefono' ? 'Chiamata' : tipoContatto === 'email' ? 'Email' : 'SMS'}
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Annulla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Destinatario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="text-lg">{pratica.automobilista.nome} {pratica.automobilista.cognome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Contatti</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{pratica.automobilista.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="break-all">{pratica.automobilista.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Veicolo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veicolo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Targa</span>
                  <span>{pratica.veicolo.targa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marca</span>
                  <span>{pratica.veicolo.marca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modello</span>
                  <span>{pratica.veicolo.modello}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Anno</span>
                  <span>{pratica.veicolo.anno}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stato Pratica */}
            <Card>
              <CardHeader>
                <CardTitle>Stato Pratica</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getStatoLabel(pratica.stato)} text-sm py-2 px-3`}>
                  {getStatoLabel(pratica.stato)}
                </Badge>
                <p className="text-sm text-gray-600 mt-3">
                  Numero: {pratica.numero}
                </p>
                <p className="text-sm text-gray-600">
                  Apertura: {new Date(pratica.dataApertura).toLocaleDateString('it-IT')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}