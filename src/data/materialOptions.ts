// ============================================================
// PENTAHOUSE CRM — Material Category → Name Dependent Dropdown
// ============================================================

import { MaterialCategory } from '@/lib/types';

export const materialCategoryOptions: MaterialCategory[] = [
  'Construction Materials',
  'Wood Materials',
  'Plumbing Materials',
  'Electrical Materials',
  'Steel Work',
  'Interior',
  'POP',
  'Paints',
  'Tiles & Granite',
];

export const materialNamesByCategory: Record<MaterialCategory, string[]> = {
  'Construction Materials': [
    'Jalli',
    'M Sand',
    'P Sand',
    'River Sand',
    'Steel',
    'Cement',
    'Concrete',
  ],
  'Wood Materials': ['Shutters', 'Doors', 'Hardware'],
  'Plumbing Materials': ['Raw Materials', 'Fittings'],
  'Electrical Materials': ['Wire', 'Switch', 'MCB', 'Conduit Pipe', 'DB Box'],
  'Steel Work': ['SS', 'MS'],
  Interior: ['Wardrobe', 'Kitchen', 'TV Unit', 'False Ceiling', 'Partition'],
  POP: ['Ceiling POP', 'Wall POP', 'Decorative POP'],
  Paints: ['Primer', 'Putty', 'Interior Paint', 'Exterior Paint'],
  'Tiles & Granite': ['Tiles', 'Granite', 'Marble'],
};
