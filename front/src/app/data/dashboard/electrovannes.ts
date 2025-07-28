export type Electrovanne = {
  id: number;
  vanneName: string;
  statusMode: 'manuel' | 'auto';
  devEUI: string;
  isActivated: boolean;
};

export const electrovanneList: Electrovanne[] = [
  {
    id: 1,
    vanneName: 'Vanne Nord',
    statusMode: 'manuel',
    devEUI: '00124A0007B4F1A1',
    isActivated: false,
  },
  {
    id: 2,
    vanneName: 'Vanne Sud',
    statusMode: 'auto',
    devEUI: '00124A0007B4F1B2',
    isActivated: true,
  },
  {
    id: 3,
    vanneName: 'Vanne Est',
    statusMode: 'manuel',
    devEUI: '00124A0007B4F1C3',
    isActivated: false,
  },
  {
    id: 4,
    vanneName: 'Vanne Ouest',
    statusMode: 'auto',
    devEUI: '00124A0007B4F1D4',
    isActivated: true,
  },
  {
    id: 5,
    vanneName: 'Vanne Centrale',
    statusMode: 'manuel',
    devEUI: '00124A0007B4F1E5',
    isActivated: false,
  },
];