import React, { useState, useEffect } from 'react';
import { PenTool, MessageSquare, FileText, Download, Trash2 } from 'lucide-react';
import styles from './Activities.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { fetchActivities, deleteActivity } from '../services/activityService';
import WriteActivityForm from '../components/features/WriteActivityForm';
import PasswordPrompt from '../components/features/PasswordPrompt';

const Activities = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapsedItems, setCollapsedItems] = useState(new Set());
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const toggleCollapse = (id) => {
        setCollapsedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDeleteClick = (activityId) => {
        setDeleteTargetId(activityId);
    };

    const handleDeleteConfirm = async (passwordHash) => {
        try {
            const success = await deleteActivity(deleteTargetId, passwordHash);
            if (success) {
                alert('삭제되었습니다.');
                const data = await fetchActivities(activeTab);
                setActivities(data);
                setDeleteTargetId(null);
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } catch (err) {
            console.error('Delete failed', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
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
                                    <div>
                                        <span className={styles.tag}>
                                            {item.category === 'notice' ? '📢 공지' :
                                                item.category === 'assignment' ? '📝 과제' :
                                                    item.category === 'question' ? '❓ 질문' :
                                                        item.category === 'review' ? '⭐ 후기' :
                                                            item.category === 'discussion' ? '💬 토론' : '활동'}
                                        </span>
                                        <span className={styles.date}>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af' }}
                                        aria-label="삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                {item.book_title && <div className={styles.bookTag}>#{item.book_title}</div>}

                                {item.category === 'assignment' && item.due_date && (
                                    <div className={styles.dueDate}>마감: {new Date(item.due_date).toLocaleDateString()}</div>
                                )}

                                {!collapsedItems.has(item.id) && (
                                    <div className={styles.content}>
                                        {item.content}
                                    </div>
                                )}

                                <div className={styles.footer}>
                                    {item.user_name && <span className={styles.user}>by {item.user_name}</span>}
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => toggleCollapse(item.id)}
                                    >
                                        {!collapsedItems.has(item.id) ? '접기' : '더보기'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'notice' && (
                <button className={styles.fab} onClick={() => setShowWriteForm(true)}>
                    <PenTool size={24} />
                </button>
            )}

            {showWriteForm && (
                <WriteActivityForm
                    category="notice"
                    book={null}
                    onClose={() => setShowWriteForm(false)}
                    onSuccess={async () => {
                        // Refresh list
                        const data = await fetchActivities(activeTab);
                        setActivities(data);
                    }}
                />
            )}

            {deleteTargetId && (
                <PasswordPrompt
                    onClose={() => setDeleteTargetId(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default Activities;
