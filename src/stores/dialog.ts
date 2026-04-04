import { defineStore } from 'pinia';

export interface DialogOptions {
  title?: string;
  content: string;
  variant?: 'default' | 'danger' | 'accent';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    show: false,
    options: {
      title: '',
      content: '',
      variant: 'default',
      confirmText: '确定',
      cancelText: '取消',
    } as DialogOptions,
    isConfirm: false,
  }),
  actions: {
    alert(content: string, title: string = '提示', variant: DialogOptions['variant'] = 'default') {
      this.options = { 
        content, 
        title, 
        variant, 
        confirmText: '了解', 
        cancelText: '' 
      };
      this.isConfirm = false;
      this.show = true;
    },
    confirm(options: DialogOptions) {
      this.options = {
        title: '确认',
        confirmText: '确认',
        cancelText: '取消',
        variant: 'default',
        ...options,
      };
      this.isConfirm = true;
      this.show = true;
    },
    close() {
      this.show = false;
    },
    handleConfirm() {
      if (this.options.onConfirm) this.options.onConfirm();
      this.close();
    },
    handleCancel() {
      if (this.options.onCancel) this.options.onCancel();
      this.close();
    }
  },
});
