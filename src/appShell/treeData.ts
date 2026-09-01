export interface TreeNode {
  id: string;
  label: string;
  count: number;
  children?: TreeNode[];
}

export const TREE_DATA: TreeNode[] = [
  {
    id: 'medday',
    label: 'MEDDAY SPI2',
    count: 45,
    children: [
      { id: 'maverick-1', label: '2456 - Maverick, L', count: 70 },
      { id: 'miles-1', label: '0982 - Miles, H', count: 79 },
      {
        id: 'milevich-1',
        label: '2567 - Milevich, K',
        count: 32,
        children: [{ id: 'sponsor-coord', label: '01.1_Sponsor_Coordina…', count: 16 }],
      },
      {
        id: 'makkey',
        label: '9823 - Makkey, K',
        count: 25,
        children: [
          { id: 'study-overview', label: '02.1_Study Overview of in…', count: 55 },
          { id: 'delegation', label: '02.2_Delegation', count: 60 },
          {
            id: 'staff-qual',
            label: '02.3_Staff Qualification r...',
            count: 53,
            children: [{ id: 'staff-qual-leaf', label: 'Staff Qualification Records', count: 53 }],
          },
        ],
      },
    ],
  },
  {
    id: 'connect-hf',
    label: 'CONNECT-HF',
    count: 46,
    children: [
      { id: 'milkway', label: '3289 - Milkway, L', count: 13 },
      { id: 'miles-2', label: '0982 - Miles, H', count: 56 },
      { id: 'maverick-2', label: '2456 - Maverick, L', count: 50 },
      { id: 'milevich-2', label: '2567 - Milevich, K', count: 33 },
      { id: 'verne', label: '1234 - Verne, J', count: 80 },
      { id: 'clark', label: '1267 - Clark, S', count: 42 },
    ],
  },
  { id: 'pluristem', label: 'Pluristem', count: 57, children: [{ id: 'pluristem-leaf', label: 'Documents', count: 57 }] },
  { id: 'mali', label: 'Mali', count: 48, children: [{ id: 'mali-leaf', label: 'Documents', count: 48 }] },
  { id: 'republica', label: 'Republica Checa', count: 15, children: [{ id: 'republica-leaf', label: 'Documents', count: 15 }] },
];

export const DEFAULT_EXPANDED = ['medday', 'connect-hf', 'milevich-1', 'makkey'];
export const DEFAULT_SELECTED = 'milevich-1';
