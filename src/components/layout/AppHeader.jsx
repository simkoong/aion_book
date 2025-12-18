import React from 'react';
import { Bell } from 'lucide-react';
import styles from './AppHeader.module.css';

const AppHeader = ({ title = "아이온 책모임" }) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <button className={styles.iconButton} aria-label="Notifications">
                <Bell size={24} />
            </button>
        </header>
    );
};

export default AppHeader;
