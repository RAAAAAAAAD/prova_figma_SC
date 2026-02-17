// Dati mock per simulare le pratiche dell'officina

export type StatoVeicolo = 'non_assegnata' | 'in_attesa' | 'in_lavorazione' | 'in_attesa_riconsegna' | 'completata';

export interface Preventivo {
  id: string;
  dataEmissione: string;
  importoTotale: number;
  tempoStimato: string;
  interventi: {
    descrizione: string;
    costo: number;
  }[];
  note?: string;
}

export interface Automobilista {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
}

export interface Veicolo {
  targa: string;
  marca: string;
  modello: string;
  anno: number;
}

export interface Cronologia {
  data: string;
  stato: StatoVeicolo;
  nota?: string;
  operatore?: string;
}

export interface Pratica {
  id: string;
  numero: string;
  dataApertura: string;
  stato: StatoVeicolo;
  veicolo: Veicolo;
  automobilista: Automobilista;
  preventivo: Preventivo;
  cronologia: Cronologia[];
  noteInterne?: string;
  assegnata: boolean;
  // Campi per compatibilità con DettaglioPratica
  targa: string;
  marca: string;
  modello: string;
  cliente: string;
  telefono: string;
  email: string;
  dataArrivo: string;
  importo: number;
  perito: string;
  compagnia: string;
  descrizione?: string;
}

export const praticheMock: Pratica[] = [
  {
    id: '1',
    numero: 'PR-2026-001',
    dataApertura: '2026-02-01',
    stato: 'in_lavorazione',
    veicolo: {
      targa: 'AB123CD',
      marca: 'Fiat',
      modello: '500',
      anno: 2020
    },
    automobilista: {
      nome: 'Mario',
      cognome: 'Rossi',
      telefono: '+39 333 1234567',
      email: 'mario.rossi@email.it'
    },
    preventivo: {
      id: 'PREV-001',
      dataEmissione: '2026-01-30',
      importoTotale: 1250.00,
      tempoStimato: '5 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Sostituzione paraurti anteriore',
          costo: 450.00
        },
        {
          descrizione: 'Verniciatura',
          costo: 300.00
        },
        {
          descrizione: 'Riparazione faro sinistro',
          costo: 350.00
        },
        {
          descrizione: 'Manodopera',
          costo: 150.00
        }
      ],
      note: 'Parti di ricambio originali Fiat'
    },
    cronologia: [
      {
        data: '2026-02-01T09:00:00',
        stato: 'in_attesa',
        nota: 'Pratica assegnata all\'officina'
      },
      {
        data: '2026-02-03T10:30:00',
        stato: 'in_lavorazione',
        nota: 'Veicolo ricevuto in officina e iniziati lavori',
        operatore: 'Giovanni Bianchi'
      }
    ],
    noteInterne: 'Controllare disponibilità faro originale presso fornitore',
    assegnata: true,
    targa: 'AB123CD',
    marca: 'Fiat',
    modello: '500',
    cliente: 'Mario Rossi',
    telefono: '+39 333 1234567',
    email: 'mario.rossi@email.it',
    dataArrivo: '2026-02-03',
    importo: 1250.00,
    perito: 'Dott. Giovanni Verdi',
    compagnia: 'Generali',
    descrizione: 'Danni alla parte anteriore del veicolo a seguito di incidente stradale'
  },
  {
    id: '2',
    numero: 'PR-2026-002',
    dataApertura: '2026-02-05',
    stato: 'in_attesa_riconsegna',
    veicolo: {
      targa: 'EF456GH',
      marca: 'Volkswagen',
      modello: 'Golf',
      anno: 2019
    },
    automobilista: {
      nome: 'Laura',
      cognome: 'Verdi',
      telefono: '+39 348 7654321',
      email: 'laura.verdi@email.it'
    },
    preventivo: {
      id: 'PREV-002',
      dataEmissione: '2026-02-04',
      importoTotale: 2100.00,
      tempoStimato: '7 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Sostituzione portiera posteriore destra',
          costo: 800.00
        },
        {
          descrizione: 'Riparazione sistema chiusura centralizzata',
          costo: 250.00
        },
        {
          descrizione: 'Verniciatura completa lato destro',
          costo: 750.00
        },
        {
          descrizione: 'Manodopera',
          costo: 300.00
        }
      ]
    },
    cronologia: [
      {
        data: '2026-02-05T08:30:00',
        stato: 'in_attesa',
        nota: 'Pratica assegnata all\'officina'
      },
      {
        data: '2026-02-06T11:00:00',
        stato: 'in_lavorazione',
        nota: 'Veicolo ricevuto in officina',
        operatore: 'Marco Neri'
      },
      {
        data: '2026-02-10T16:00:00',
        stato: 'in_attesa_riconsegna',
        nota: 'Riparazione completata, veicolo pronto per riconsegna',
        operatore: 'Marco Neri'
      }
    ],
    noteInterne: 'Cliente ha richiesto foto prima e dopo la riparazione',
    assegnata: true,
    targa: 'EF456GH',
    marca: 'Volkswagen',
    modello: 'Golf',
    cliente: 'Laura Verdi',
    telefono: '+39 348 7654321',
    email: 'laura.verdi@email.it',
    dataArrivo: '2026-02-06',
    importo: 2100.00,
    perito: 'Dott. Marco Blu',
    compagnia: 'Allianz',
    descrizione: 'Danni alla portiera posteriore destra e sistema di chiusura'
  },
  {
    id: '3',
    numero: 'PR-2026-003',
    dataApertura: '2026-02-08',
    stato: 'in_attesa',
    veicolo: {
      targa: 'IJ789LM',
      marca: 'Renault',
      modello: 'Clio',
      anno: 2021
    },
    automobilista: {
      nome: 'Giuseppe',
      cognome: 'Gialli',
      telefono: '+39 339 9876543',
      email: 'giuseppe.gialli@email.it'
    },
    preventivo: {
      id: 'PREV-003',
      dataEmissione: '2026-02-07',
      importoTotale: 850.00,
      tempoStimato: '3 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Sostituzione specchietto retrovisore destro',
          costo: 180.00
        },
        {
          descrizione: 'Riparazione graffi portiera anteriore destra',
          costo: 420.00
        },
        {
          descrizione: 'Ritocco vernice',
          costo: 150.00
        },
        {
          descrizione: 'Manodopera',
          costo: 100.00
        }
      ],
      note: 'Riparazione danni da parcheggio'
    },
    cronologia: [
      {
        data: '2026-02-08T10:00:00',
        stato: 'in_attesa',
        nota: 'Pratica assegnata all\'officina. In attesa della consegna del veicolo'
      }
    ],
    noteInterne: 'Verificare disponibilità specchietto retrovisore',
    assegnata: true,
    targa: 'IJ789LM',
    marca: 'Renault',
    modello: 'Clio',
    cliente: 'Giuseppe Gialli',
    telefono: '+39 339 9876543',
    email: 'giuseppe.gialli@email.it',
    dataArrivo: '2026-02-08',
    importo: 850.00,
    perito: 'Dott.ssa Anna Rossi',
    compagnia: 'UnipolSai',
    descrizione: 'Danni da parcheggio a specchietto e portiera anteriore destra'
  },
  {
    id: '4',
    numero: 'PR-2026-004',
    dataApertura: '2026-01-28',
    stato: 'completata',
    veicolo: {
      targa: 'NO012PQ',
      marca: 'Peugeot',
      modello: '208',
      anno: 2018
    },
    automobilista: {
      nome: 'Anna',
      cognome: 'Blu',
      telefono: '+39 347 5551234',
      email: 'anna.blu@email.it'
    },
    preventivo: {
      id: 'PREV-004',
      dataEmissione: '2026-01-27',
      importoTotale: 1680.00,
      tempoStimato: '6 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Sostituzione cofano motore',
          costo: 550.00
        },
        {
          descrizione: 'Riparazione griglia anteriore',
          costo: 280.00
        },
        {
          descrizione: 'Sostituzione logo anteriore',
          costo: 80.00
        },
        {
          descrizione: 'Verniciatura',
          costo: 520.00
        },
        {
          descrizione: 'Manodopera',
          costo: 250.00
        }
      ]
    },
    cronologia: [
      {
        data: '2026-01-28T09:00:00',
        stato: 'in_attesa',
        nota: 'Pratica assegnata all\'officina'
      },
      {
        data: '2026-01-29T10:00:00',
        stato: 'in_lavorazione',
        nota: 'Veicolo ricevuto in officina',
        operatore: 'Giovanni Bianchi'
      },
      {
        data: '2026-02-04T17:00:00',
        stato: 'in_attesa_riconsegna',
        nota: 'Riparazione completata',
        operatore: 'Giovanni Bianchi'
      },
      {
        data: '2026-02-05T11:30:00',
        stato: 'completata',
        nota: 'Veicolo riconsegnato al cliente',
        operatore: 'Luca Rossi'
      }
    ],
    assegnata: true,
    targa: 'NO012PQ',
    marca: 'Peugeot',
    modello: '208',
    cliente: 'Anna Blu',
    telefono: '+39 347 5551234',
    email: 'anna.blu@email.it',
    dataArrivo: '2026-01-29',
    importo: 1680.00,
    perito: 'Dott. Luca Neri',
    compagnia: 'Generali',
    descrizione: 'Danni al cofano motore e griglia anteriore'
  },
  {
    id: '5',
    numero: 'PR-2026-005',
    dataApertura: '2026-02-09',
    stato: 'in_lavorazione',
    veicolo: {
      targa: 'RS345TU',
      marca: 'Opel',
      modello: 'Corsa',
      anno: 2022
    },
    automobilista: {
      nome: 'Francesco',
      cognome: 'Neri',
      telefono: '+39 335 4443332',
      email: 'francesco.neri@email.it'
    },
    preventivo: {
      id: 'PREV-005',
      dataEmissione: '2026-02-08',
      importoTotale: 950.00,
      tempoStimato: '4 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Riparazione paraurti posteriore',
          costo: 380.00
        },
        {
          descrizione: 'Sostituzione fanale posteriore sinistro',
          costo: 220.00
        },
        {
          descrizione: 'Verniciatura paraurti',
          costo: 250.00
        },
        {
          descrizione: 'Manodopera',
          costo: 100.00
        }
      ],
      note: 'Danni da tamponamento lieve'
    },
    cronologia: [
      {
        data: '2026-02-09T08:00:00',
        stato: 'in_attesa',
        nota: 'Pratica assegnata all\'officina'
      },
      {
        data: '2026-02-10T09:15:00',
        stato: 'in_lavorazione',
        nota: 'Veicolo ricevuto in officina',
        operatore: 'Marco Neri'
      }
    ],
    noteInterne: 'Cliente ha richiesto completamento entro venerdì',
    assegnata: true,
    targa: 'RS345TU',
    marca: 'Opel',
    modello: 'Corsa',
    cliente: 'Francesco Neri',
    telefono: '+39 335 4443332',
    email: 'francesco.neri@email.it',
    dataArrivo: '2026-02-10',
    importo: 950.00,
    perito: 'Dott. Paolo Verdi',
    compagnia: 'Allianz',
    descrizione: 'Danni da tamponamento al paraurti posteriore'
  },
  {
    id: '6',
    numero: 'PR-2026-006',
    dataApertura: '2026-02-11',
    stato: 'non_assegnata',
    veicolo: {
      targa: 'VW567XY',
      marca: 'BMW',
      modello: 'Serie 3',
      anno: 2021
    },
    automobilista: {
      nome: 'Marco',
      cognome: 'Bianchi',
      telefono: '+39 340 1112233',
      email: 'marco.bianchi@email.it'
    },
    preventivo: {
      id: 'PREV-006',
      dataEmissione: '2026-02-10',
      importoTotale: 1850.00,
      tempoStimato: '6 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Sostituzione portiera anteriore sinistra',
          costo: 950.00
        },
        {
          descrizione: 'Verniciatura',
          costo: 600.00
        },
        {
          descrizione: 'Manodopera',
          costo: 300.00
        }
      ],
      note: 'Preventivo da approvare'
    },
    cronologia: [
      {
        data: '2026-02-11T09:00:00',
        stato: 'non_assegnata',
        nota: 'Nuova pratica da assegnare'
      }
    ],
    assegnata: false,
    targa: 'VW567XY',
    marca: 'BMW',
    modello: 'Serie 3',
    cliente: 'Marco Bianchi',
    telefono: '+39 340 1112233',
    email: 'marco.bianchi@email.it',
    dataArrivo: '2026-02-11',
    importo: 1850.00,
    perito: 'Dott. Stefano Rossi',
    compagnia: 'UnipolSai',
    descrizione: 'Danni alla portiera anteriore sinistra'
  },
  {
    id: '7',
    numero: 'PR-2026-007',
    dataApertura: '2026-02-11',
    stato: 'non_assegnata',
    veicolo: {
      targa: 'ZA890BC',
      marca: 'Audi',
      modello: 'A4',
      anno: 2020
    },
    automobilista: {
      nome: 'Giulia',
      cognome: 'Ferrari',
      telefono: '+39 338 4445566',
      email: 'giulia.ferrari@email.it'
    },
    preventivo: {
      id: 'PREV-007',
      dataEmissione: '2026-02-10',
      importoTotale: 980.00,
      tempoStimato: '4 giorni lavorativi',
      interventi: [
        {
          descrizione: 'Riparazione paraurti posteriore',
          costo: 420.00
        },
        {
          descrizione: 'Sostituzione sensore parcheggio',
          costo: 180.00
        },
        {
          descrizione: 'Verniciatura',
          costo: 280.00
        },
        {
          descrizione: 'Manodopera',
          costo: 100.00
        }
      ]
    },
    cronologia: [
      {
        data: '2026-02-11T10:30:00',
        stato: 'non_assegnata',
        nota: 'Nuova pratica da assegnare'
      }
    ],
    assegnata: false,
    targa: 'ZA890BC',
    marca: 'Audi',
    modello: 'A4',
    cliente: 'Giulia Ferrari',
    telefono: '+39 338 4445566',
    email: 'giulia.ferrari@email.it',
    dataArrivo: '2026-02-11',
    importo: 980.00,
    perito: 'Dott.ssa Maria Blu',
    compagnia: 'Generali',
    descrizione: 'Danni al paraurti posteriore e sensore parcheggio'
  }
];

export const getStatoLabel = (stato: StatoVeicolo): string => {
  const labels: Record<StatoVeicolo, string> = {
    non_assegnata: 'Non Assegnata',
    in_attesa: 'In attesa di arrivo',
    in_lavorazione: 'In Lavorazione',
    in_attesa_riconsegna: 'In attesa riconsegna',
    completata: 'Completata'
  };
  return labels[stato];
};

export const getStatoColor = (stato: StatoVeicolo): string => {
  const colors: Record<StatoVeicolo, string> = {
    non_assegnata: 'bg-[#F3F4F4] text-[#10546D] border-[#7AB2B2]',
    in_attesa: 'bg-[#EBF4F6] text-[#10546D] border-[#7AB2B2]',
    in_lavorazione: 'bg-[#7AB2B2]/20 text-[#09637E] border-[#7AB2B2]',
    in_attesa_riconsegna: 'bg-[#088395]/10 text-[#088395] border-[#088395]',
    completata: 'bg-[#10546D]/10 text-[#10546D] border-[#10546D]'
  };
  return colors[stato];
};
