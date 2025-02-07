export interface Item {
    id: string;
    contact: string;
    itemName: string;
    description: string;
    location: string;
    date: string;
    image?: string;
    status: 'lost' | 'found' | 'all';
  }
  