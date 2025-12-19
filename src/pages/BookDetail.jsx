import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PenTool, Trash2 } from 'lucide-react';
import styles from './BookDetail.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { fetchBookById } from '../services/bookService';
import { fetchBookActivities, deleteActivity } from '../services/activityService';
import WriteActivityForm from '../components/features/WriteActivityForm';
import PasswordPrompt from '../components/features/PasswordPrompt';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [book, setBook] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    // Load Book
    useEffect(() => {
        const loadBook = async () => {
            try {
                const data = await fetchBookById(id);
                setBook(data);
            } catch (err) {
                console.error('Failed to load book', err);
            } finally {
                setLoading(false);
            }
        };
        loadBook();
    }, [id]);

    // Load Activities
    useEffect(() => {
        const loadActivities = async () => {
            if (activeTab === 'discussion' || activeTab === 'review') {
                try {
                    const data = await fetchBookActivities(id, activeTab);
                    setActivities(data);
                } catch (err) {
                    console.error('Failed to load activities', err);
                }
            }
        };
        loadActivities();
    }, [id, activeTab]);

    const handleWriteSuccess = () => {
        const loadActivities = async () => {
            const data = await fetchBookActivities(id, activeTab);
            setActivities(data);
        };
        loadActivities();
    };

    const handleDeleteClick = (activityId) => {
        setDeleteTargetId(activityId);
    };

    const handleDeleteConfirm = async (passwordHash) => {
        try {
            const success = await deleteActivity(deleteTargetId, passwordHash);
            if (success) {
                alert('삭제되었습니다.');
                const data = await fetchBookActivities(id, activeTab);
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

    if (loading) return <div className={styles.container}>로딩 중...</div>;
    if (!book) return <div className={styles.container}>Book not found</div>;

    const tabs = [
        { id: 'info', label: '정보' },
        { id: 'discussion', label: '토론' },
        { id: 'review', label: '후기' },
        { id: 'materials', label: '자료' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className={styles.bookInfo}>
                <div className={styles.coverWrapper}>
                    <img src={book.coverUrl || book.cover_url} alt={book.title} className={styles.cover} />
                </div>
                <h1 className={styles.title}>{book.title}</h1>
                <p className={styles.author}>{book.author}</p>
                <p className={styles.desc}>{book.description}</p>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={styles.content}>
                {activeTab === 'info' && (
                    <div className={styles.tabContent}>
                        <h3>책 소개</h3>
                        <p>{book.book_info || `${book.title}에 대한 상세 소개가 준비 중입니다.`}</p>
                    </div>
                )}

                {(activeTab === 'discussion' || activeTab === 'review') && (
                    <div className={styles.tabList}>
                        {activities.length === 0 ? (
                            <div className={styles.emptyState}>아직 등록된 글이 없습니다.</div>
                        ) : (
                            activities.map(item => (
                                <div key={item.id} className={activeTab === 'review' ? styles.reviewCard : styles.listItem}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            {activeTab === 'discussion' ? (
                                                <>
                                                    <div className={styles.listIcon}><MessageCircle size={20} /></div>
                                                    <div>
                                                        <h4>{item.title}</h4>
                                                        <span className={styles.meta}>{item.user_name} · {new Date(item.created_at).toLocaleDateString()}</span>
                                                        <p className={styles.itemContent}>{item.content}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={styles.reviewHeader}>
                                                        <span className={styles.reviewer}>{item.user_name}</span>
                                                        <span className={styles.date}>{new Date(item.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p>{item.content}</p>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af', marginLeft: '8px' }}
                                            aria-label="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <button className={styles.fab} onClick={() => setShowWriteForm(true)}>
                            <PenTool size={24} />
                        </button>
                    </div>
                )}
            </div>

            {showWriteForm && (
                <WriteActivityForm
                    category={activeTab}
                    book={book}
                    onClose={() => setShowWriteForm(false)}
                    onSuccess={handleWriteSuccess}
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

export default BookDetail;
