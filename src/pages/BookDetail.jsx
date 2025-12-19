import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PenTool, Link as LinkIcon, Download } from 'lucide-react';
import styles from './BookDetail.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { fetchBookById } from '../services/bookService';
import { fetchBookActivities } from '../services/activityService';
import WriteActivityForm from '../components/features/WriteActivityForm';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [book, setBook] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWriteForm, setShowWriteForm] = useState(false);

    // Load book data
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

    // Load activities when tab changes
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
        // Refresh activities
        const loadActivities = async () => {
            const data = await fetchBookActivities(id, activeTab);
            setActivities(data);
        };
        loadActivities();
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
            {/* Header with Back Button */}
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Book Info Section */}
            <div className={styles.bookInfo}>
                <div className={styles.coverWrapper}>
                    <img src={book.coverUrl || book.cover_url} alt={book.title} className={styles.cover} />
                </div>
                <h1 className={styles.title}>{book.title}</h1>
                <p className={styles.author}>{book.author}</p>
                <p className={styles.desc}>{book.description}</p>
            </div>

            {/* Tabs */}
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
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
        </div>
    );
};

export default BookDetail;
