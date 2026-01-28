import { createSlice } from "@reduxjs/toolkit";


const uiSlice = createSlice({
    name : "ui",
    initialState : {
        isSidebarOpen : true,
        isMobileMenuOpen: false, 
    },
    reducers :{
        toggleSidebar : (state) => {
           state.isSidebarOpen = !state.isSidebarOpen;
        },
        openMobileMenu: (state) => {
        state.isMobileMenuOpen = true;
        },
        closeMobileMenu: (state) => {
        state.isMobileMenuOpen = false;
        },
    }
})


export const { toggleSidebar, openMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;