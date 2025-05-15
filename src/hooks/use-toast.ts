
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  toast as sonnerToast,
  ToastT
} from "sonner"

type ToastProps_ = ToastProps

// Create a type that's compatible with both our ToastProps and sonner's expected props
interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
}

const useToast = () => {
  return {
    toast: ({ title, description, variant, action }: ToastOptions) => {
      if (variant === "destructive") {
        return sonnerToast.error(title as string, {
          description: description,
        })
      }

      return sonnerToast(title as string, {
        description: description,
      })
    },
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    // Add empty toasts array for compatibility with toaster.tsx
    toasts: [],
  }
}

export { useToast }
export const toast = sonnerToast
// Use export type for re-exporting types with isolatedModules enabled
export type { Toast, ToastProps_ as ToastProps, ToastActionElement }
