import React from 'react';
import styles from './TabNavigation.module.css';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className={styles.container}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
