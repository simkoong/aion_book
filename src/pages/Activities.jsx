import React, { useState, useEffect } from 'react';
import { PenTool, MessageSquare, FileText, Download } from 'lucide-react';
import styles from './Activities.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { fetchActivities } from '../services/activityService';

const Activities = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedItems, setExpandedItems] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const tabs = [
        { id: 'all', label: '전체' },
        { id: 'notice', label: '공지' },
        { id: 'discussion', label: '토론' },
        { id: 'review', label: '후기' },
    ];

    useEffect(() => {
        const loadActivities = async () => {
            setLoading(true);
            try {
                const data = await fetchActivities(activeTab);
                setActivities(data);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('활동 내역을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, [activeTab]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>스터디 활동</h2>
            </header>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {loading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.list}>
                    {activities.length === 0 ? (
                        <div className={styles.empty}>등록된 활동이 없습니다.</div>
                    ) : (
                        activities.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag}>
                                        {item.category === 'notice' ? '📢 공지' :
                                            item.category === 'assignment' ? '📝 과제' :
                                                item.category === 'question' ? '❓ 질문' :
                                                    item.category === 'review' ? '⭐ 후기' :
                                                        item.category === 'discussion' ? '💬 토론' : '활동'}
                                    </span>
                                    {/* Format date if needed, or assume DB string is fine for now, or use date-fns */}
                                    <span className={styles.date}>{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                {item.book_title && <div className={styles.bookTag}>#{item.book_title}</div>}

                                {item.category === 'assignment' && item.due_date && (
                                    <div className={styles.dueDate}>마감: {new Date(item.due_date).toLocaleDateString()}</div>
                                )}

                                {expandedItems.has(item.id) && (
                                    <div className={styles.content}>
                                        {item.content}
                                    </div>
                                )}

                                <div className={styles.footer}>
                                    {item.user_name && <span className={styles.user}>by {item.user_name}</span>}
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        {expandedItems.has(item.id) ? '접기' : '더보기'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <button className={styles.fab}>
                <PenTool size={24} />
            </button>
        </div>
    );
};

export default Activities;
