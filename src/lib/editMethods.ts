import type { EditMethods, Item, Id } from '../components/types';
import supabase from './supabase';


interface Change {
    id: Id;
    parent?: Id;
    type?: "folder" | "link";
    text?: string;
    url?: string;
    action: "create" | "update" | "delete";
}

class EditMethodsImpl implements EditMethods {

    private changes: Change[] = [];


    addItem(item: Item) {
        this.changes.push({ ...item, action: "create" });
    }

    deleteItem(itemId: Id) {
        // console.log("Deleting item:", itemId);
        if (this.changes.some(change => change.id === itemId && change.action === "create")) {
            this.changes = this.changes.filter(change => change.id !== itemId);
        } else {
            this.changes.push({ id: itemId, action: "delete" });

        }
    }

    updateItem(item: Item) {
        const existingChange = this.changes.find(change => change.id === item.id);
        if (existingChange) {
            if (existingChange.action === "create") {
                Object.assign(existingChange, item);
            } else if (existingChange.action === "update") {
                Object.assign(existingChange, item);
            } else if (existingChange.action === "delete") {
                console.warn(`Cannot update item ${item.id} as it is marked for deletion.`);
            }
        } else {
            this.changes.push({ ...item, action: "update" });

        }
    }

    async setTitle(title: string, url: string) {
        const { error } = await supabase
            .from("z_link")
            .update({ title })
            .eq("url", url)


        if (error) {
            console.error('Error updating title:', error);
            throw error;
        }

    }

    async submitChanges(isNewTree: boolean, title: string, url?: string) {
        console.log("Submitting changes:", this.changes);
        
        if (this.changes.length !== 0) {
            if (isNewTree) {
                try {
                    const sanitizedChanges = this.changes.map(({ action, ...rest }) => rest);
                    const { data, error } = await supabase.functions.invoke('create_tree', {
                        body: sanitizedChanges,
                    });

                    if (error) throw error;

                    url = data.url;
                    console.log('Created tree successfully:', data, url);

                } catch (err) {
                    console.log("Error creating tree", err);
                    throw err;
                }

            } else {
                try {
                    const { data, error } = await supabase.functions.invoke('update_nodes', {
                        body: this.changes
                    });

                    if (error) throw error;

                    console.log('Changes submitted successfully:', data);
                } catch (err) {
                    console.error('Error submitting changes via Edge Function:', err);
                    throw err;
                }
            }
        }

        await this.setTitle(title, url!);

        this.changes = [];

        return url;
    }

}

export default new EditMethodsImpl();