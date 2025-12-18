import React, { useState } from 'react';
import { PenTool, MessageSquare, FileText, Download } from 'lucide-react';
import styles from './Activities.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { NOTICES, ACTIVITIES } from '../data/mockData';

const Activities = () => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: '전체' },
        { id: 'notice', label: '공지' },
        { id: 'discussion', label: '토론' },
        { id: 'review', label: '후기' },
    ];

    // Simple filtering mock
    const filteredItems = activeTab === 'all'
        ? [...NOTICES, ...ACTIVITIES]
        : activeTab === 'notice'
            ? NOTICES
            : ACTIVITIES.filter(a => a.action === activeTab || (activeTab === 'discussion' && a.action === 'question'));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>스터디 활동</h2>
            </header>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={styles.list}>
                {filteredItems.map((item, index) => (
                    <div key={item.id || index} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.tag}>
                                {item.type === 'notice' || item.action === 'notice' ? '📢 공지' :
                                    item.type === 'assignment' ? '📝 과제' :
                                        item.action === 'question' ? '❓ 질문' :
                                            item.action === 'review' ? '⭐ 후기' : '활동'}
                            </span>
                            <span className={styles.date}>{item.date || item.timestamp}</span>
                        </div>
                        <h3 className={styles.cardTitle}>{item.title || item.content}</h3>
                        {item.bookTitle && <div className={styles.bookTag}>#{item.bookTitle}</div>}

                        {/* Additional info based on type */}
                        {item.type === 'assignment' && (
                            <div className={styles.dueDate}>마감: {item.dueDate}</div>
                        )}

                        <div className={styles.footer}>
                            {item.user && <span className={styles.user}>by {item.user}</span>}
                            <button className={styles.actionButton}>더보기</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.fab}>
                <PenTool size={24} />
            </button>
        </div>
    );
};

export default Activities;
