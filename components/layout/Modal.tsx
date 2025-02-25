import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  trigger: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  confirmText?: string;
  showCancelButton?: boolean;
  cancelText?: string;
}

const Modal = ({
  title,
  description,
  children,
  trigger,
  isOpen,
  onClose,
  onConfirm,
  showConfirmButton = true,
  confirmText = "Save changes",
  showCancelButton = true,
  cancelText = "Cancel",
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter className="flex gap-2">
          {showCancelButton && (
            <Button type="button" variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          {showConfirmButton && (
            <Button
              type="submit"
              onClick={onConfirm}
              className="bg-primary text-white hover:bg-primaryDark"
            >
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
