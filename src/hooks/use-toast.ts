
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  toast as sonnerToast,
  ToastOptions as SonnerToastOptions,
} from "sonner"

type ToastProps_ = ToastProps

const useToast = () => {
  return {
    toast: ({ title, description, variant, action }: ToastProps) => {
      if (variant === "destructive") {
        return sonnerToast.error(title, {
          description,
        })
      }

      return sonnerToast(title, {
        description,
      })
    },
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  }
}

export { useToast, Toast, ToastProps_, ToastActionElement }
export const toast = sonnerToast
