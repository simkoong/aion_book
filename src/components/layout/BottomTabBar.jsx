import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, Calendar } from 'lucide-react';
import styles from './BottomTabBar.module.css';

const BottomTabBar = () => {
    const navItems = [
        { icon: Home, label: '홈', path: '/' },
        { icon: BookOpen, label: '책', path: '/books' },
        { icon: ClipboardList, label: '활동', path: '/activities' },
        { icon: Calendar, label: '캘린더', path: '/calendar' },
    ];

    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                {navItems.map((item) => (
                    <li key={item.path} className={styles.navItem}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.active : ''}`
                            }
                        >
                            <item.icon size={24} className={styles.icon} />
                            <span className={styles.label}>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomTabBar;
