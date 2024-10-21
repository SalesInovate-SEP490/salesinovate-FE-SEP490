import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRole, getToken, isTokenExpired, removeToken, setRefreshToken, setToken } from "../../../utils/jwtUtils";

const initialState = {
  darkMode: false,
  activityTogglePopup: false,
  activityTogglePopupTwo: false,
  toggleAddCampaign: false,
  themeSettings: false,
  modalTitle: "",
  addTogglePopupTwo: false,
  headerCollapse: false,
  mobileSidebar: false,
  miniSidebar: false,
  expandMenu: false,
  isAuthenticated: false,
  user: null,
  loading: true,
  userName: "",
  avatar: "",
};
const commonSlice = createSlice({
  name: "CRMS",
  initialState,
  reducers: {
    setDarkMode: (state, { payload }) => {
      state.darkMode = payload;
    },
    setActivityTogglePopup: (state, { payload }) => {
      state.activityTogglePopup = payload;
    },
    setAddTogglePopupTwo: (state, { payload }) => {
      state.addTogglePopupTwo = payload;
    },
    setActivityTogglePopupTwo: (state, { payload }) => {
      state.activityTogglePopupTwo = payload;
    },
    setToggleAddCampaign: (state, { payload }) => {
      state.toggleAddCampaign = payload;
    },
    setThemeSettings: (state, { payload }) => {
      state.themeSettings = payload;
    },
    setModalTitle: (state, { payload }) => {
      state.modalTitle = payload;
    },
    setHeaderCollapse: (state, { payload }) => {
      state.headerCollapse = payload;
    },
    setMobileSidebar: (state, { payload }) => {
      state.mobileSidebar = payload;
    },
    setMiniSidebar: (state, { payload }) => {
      state.miniSidebar = payload;
    },
    setExpandMenu: (state, { payload }) => {
      state.expandMenu = payload;
    },
    login: (state, action: PayloadAction<{ user: any; token: string, refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user;
      const token = action.payload.token;
      if (token && !isTokenExpired(token)) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        state.userName = payload?.name || "";
      }
      setToken(action.payload.token);
      setRefreshToken(action.payload.refreshToken);

    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.userName = "";
      removeToken();
    },
    checkAuth: (state) => {
      const token = getToken();
      if (token && !isTokenExpired(token)) {
        state.isAuthenticated = true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        state.userName = payload?.name || "";
        state.user = payload;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        removeToken();
      }
      state.loading = false;
    },
    updateAvatar: (state, { payload }) => {
      state.avatar = payload;
    },
  },
});

export const { setDarkMode, setToggleAddCampaign, setAddTogglePopupTwo } =
  commonSlice.actions;
export const {
  setActivityTogglePopup,
  setHeaderCollapse,
  setMobileSidebar,
  setMiniSidebar,
  setExpandMenu,
} = commonSlice.actions;
export const { setActivityTogglePopupTwo } = commonSlice.actions;
export const { setThemeSettings } = commonSlice.actions;
export const { setModalTitle } = commonSlice.actions;
export const { login, logout, checkAuth } = commonSlice.actions;
export const { updateAvatar } = commonSlice.actions;
export default commonSlice.reducer;
export const setToogleHeader = (payload: any) => ({
  type: "toggle_header",
  payload,
});
