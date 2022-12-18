import { RootState } from "store";

export const getMenuSetting = (state: RootState) => state.menu.setting;
export const getMenuContact = (state: RootState) => state.menu.contact;
export const getMenuEdit = (state: RootState) => state.menu.edit;
export const getMenuMain = (state: RootState) => state.menu.main;
export const getMenuBugs = (state: RootState) => state.menu.bugs;
export const getMenuMessage = (state: RootState) => state.menu.menuMessage;
export const getHaveMessage = (state: RootState) => state.menu.haveMessage;
