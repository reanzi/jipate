import { create } from "zustand";

type VerificationStoreModal = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useVerificationModal = create<VerificationStoreModal>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
