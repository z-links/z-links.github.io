type Id = string | number;
type ItemType = "link" | "folder";

interface Item {
    id: Id;
    parent: Id;
    type: ItemType;
    text: string;
    url?: string;
}

interface DataItem extends Item {
    user: string
}

interface EditMethods {
    addItem: (item: Item) => void;
    updateItem: (item: Item) => void;
    deleteItem: (id: Id) => void;
    submitChanges: (isNewTree: boolean, title: string, url: string) => void;
}

export type { Id, Item, EditMethods, DataItem, ItemType };