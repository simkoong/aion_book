import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import BottomTabBar from './BottomTabBar';

const Layout = () => {
    return (
        <div style={{ paddingBottom: 'var(--bottom-nav-height)' }}>
            <AppHeader />
            <main>
                <Outlet />
            </main>
            <BottomTabBar />
        </div>
    );
};

export default Layout;
