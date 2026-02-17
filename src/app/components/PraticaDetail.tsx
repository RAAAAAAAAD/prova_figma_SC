import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Calendar,
  Euro,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Pratica, getStatoLabel, getStatoColor } from '../data/mockData';

interface PraticaDetailProps {
  pratica: Pratica;
  onBack: () => void;
  onGestioneStato: () => void;
  onContattoCliente: () => void;
}

export function PraticaDetail({ pratica, onBack, onGestioneStato, onContattoCliente }: PraticaDetailProps) {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-[#088395] border-b border-[#09637E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alla Dashboard
              </Button>
              <div>
                <h1 className="text-3xl text-white">{pratica.numero}</h1>
                <p className="text-[#EBF4F6] mt-1">Dettagli pratica e preventivo</p>
              </div>
            </div>
            <Badge className={`${getStatoColor(pratica.stato)} border text-base py-2 px-4`}>
              {getStatoLabel(pratica.stato)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="preventivo" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preventivo">Preventivo</TabsTrigger>
                <TabsTrigger value="veicolo">Veicolo</TabsTrigger>
                <TabsTrigger value="cronologia">Cronologia</TabsTrigger>
              </TabsList>

              {/* Tab Preventivo */}
              <TabsContent value="preventivo">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Preventivo Perito
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-600">ID Preventivo</p>
                        <p>{pratica.preventivo.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Data Emissione</p>
                        <p>{new Date(pratica.preventivo.dataEmissione).toLocaleDateString('it-IT')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tempo Stimato</p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {pratica.preventivo.tempoStimato}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Importo Totale</p>
                        <p className="text-2xl text-[#088395]">€{pratica.preventivo.importoTotale.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg mb-3">Interventi Previsti</h3>
                      <div className="space-y-3">
                        {pratica.preventivo.interventi.map((intervento, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p>{intervento.descrizione}</p>
                            </div>
                            <p className="text-lg">€{intervento.costo.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pratica.preventivo.note && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">Note del Perito</p>
                        <div className="bg-[#EBF4F6] border border-[#7AB2B2] rounded-lg p-4">
                          <p className="text-sm">{pratica.preventivo.note}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Veicolo */}
              <TabsContent value="veicolo">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Informazioni Veicolo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Targa</p>
                          <p className="text-xl">{pratica.veicolo.targa}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Anno Immatricolazione</p>
                          <p className="text-xl">{pratica.veicolo.anno}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Marca</p>
                          <p className="text-xl">{pratica.veicolo.marca}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Modello</p>
                          <p className="text-xl">{pratica.veicolo.modello}</p>
                        </div>
                      </div>

                      {pratica.noteInterne && (
                        <div className="mt-6 pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-2">Note Interne Officina</p>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{pratica.noteInterne}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Cronologia */}
              <TabsContent value="cronologia">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Cronologia Attività
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pratica.cronologia.map((evento, index) => (
                        <div key={index} className="relative pl-8 pb-6 last:pb-0">
                          {/* Linea verticale */}
                          {index < pratica.cronologia.length - 1 && (
                            <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
                          )}
                          
                          {/* Pallino */}
                          <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                            evento.stato === 'pronto' ? 'bg-[#088395] border-[#088395]' :
                            evento.stato === 'in_riparazione' ? 'bg-[#7AB2B2] border-[#7AB2B2]' :
                            evento.stato === 'ricevuto' ? 'bg-[#088395] border-[#088395]' :
                            evento.stato === 'riconsegnato' ? 'bg-[#10546D] border-[#10546D]' :
                            'bg-[#5F9598] border-[#5F9598]'
                          }`} />
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${getStatoColor(evento.stato)} border text-xs`}>
                                {getStatoLabel(evento.stato)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(evento.data).toLocaleDateString('it-IT')} - {new Date(evento.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {evento.nota && <p className="text-sm mb-1">{evento.nota}</p>}
                            {evento.operatore && (
                              <p className="text-xs text-gray-500">Operatore: {evento.operatore}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Automobilista
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="text-lg">{pratica.automobilista.nome} {pratica.automobilista.cognome}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Contatti</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{pratica.automobilista.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="break-all">{pratica.automobilista.email}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={onContattoCliente}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contatta Cliente
                </Button>
              </CardContent>
            </Card>

            {/* Azioni rapide */}
            <Card>
              <CardHeader>
                <CardTitle>Azioni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={onGestioneStato}
                  disabled={pratica.stato === 'riconsegnato'}
                >
                  Aggiorna Stato Veicolo
                </Button>
                
                {pratica.stato === 'pronto' && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={onContattoCliente}
                  >
                    Notifica Riconsegna
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Info Pratica */}
            <Card>
              <CardHeader>
                <CardTitle>Info Pratica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Apertura</span>
                  <span>{new Date(pratica.dataApertura).toLocaleDateString('it-IT')}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Stato Attuale</span>
                  <Badge className={`${getStatoColor(pratica.stato)} border text-xs`}>
                    {getStatoLabel(pratica.stato)}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Importo Totale</span>
                  <span className="text-lg">€{pratica.preventivo.importoTotale.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}