import { RootState } from "store";

export const getLoading = (state: RootState) => state.notification.loading;
export const getFetch = (state: RootState) => state.notification.fetch;
export const getErrors = (state: RootState) => state.notification.errors;
export const getCopy = (state: RootState) => state.notification.copy;
