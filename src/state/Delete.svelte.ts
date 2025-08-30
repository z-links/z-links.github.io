
class Delete{
    isOpen = $state(false);

    deleteFunc = async () => {};

    openModal(deleteFunc: () => Promise<void>){
        this.isOpen = true;
        this.deleteFunc = deleteFunc;
    }

    closeModal(){
        this.isOpen = false;
    }
}

export let deleteSt = new Delete();