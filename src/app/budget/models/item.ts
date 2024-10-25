export enum ItemStatus {
    PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED'
  }

  // export type CreateItem = Omit<Item, "id">
  // try add
  export interface CreateItem {
    title: string;
    amount: number;
    price: number;
  }

  export type EditIem = CreateItem
  
  export interface Item {
    id: number;
    title: string;
    amount: number;
    price: number;
    status: ItemStatus;
  }

