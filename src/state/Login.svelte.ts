import type { User } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

class Login {
    isModalOpen: boolean = $state(false);
    user = $state<User | null | string>(null);
    wannaLogin = $state(true);
    warningModalOpen = $state(false);

    constructor() {
        supabase.auth.getSession().then(({ data }) => {
            console.log("inside state")
            if (data.session?.user.id) 
                this.user = data.session?.user.id;
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user.id ?? null;
            this.isModalOpen = false;
        });
    }


    setIsModalOpen(newValue: boolean): void {
        this.isModalOpen = newValue;
    }

    openWarningModal(): void {
        this.warningModalOpen = true;
    }

    async logout(button: HTMLButtonElement | null): Promise<void> {
        button!.innerText = "Logging out..."
        await supabase.auth.signOut();
        window.location.href = "/";
    }
}

export let login = new Login();