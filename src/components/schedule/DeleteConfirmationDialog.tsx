
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog = ({ open, onOpenChange, onConfirm }: DeleteConfirmationDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="bg-viral-blue-dark border-white/10 text-white">
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/70">
          Esta ação não pode ser desfeita. O agendamento será excluído permanentemente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction 
          onClick={onConfirm}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteConfirmationDialog;
