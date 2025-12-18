import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Home.module.css';
import BookCard from '../components/features/BookCard';
import { BOOKS, NOTICES, ACTIVITIES } from '../data/mockData';

const Home = () => {
    const navigate = useNavigate();
    // Mock: Current Month is Jan (index 0)
    const currentMonthData = BOOKS[0];
    const currentMonthBooks = currentMonthData.items;

    const recentNotices = NOTICES.slice(0, 2);
    const recentActivities = ACTIVITIES.slice(0, 3);

    return (
        <div className={styles.container}>
            {/* This Month's Books */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.highlight}>{currentMonthData.month}월</span>의 책
                    </h2>
                    <button className={styles.moreLink} onClick={() => navigate('/books')}>
                        전체보기 <ChevronRight size={16} />
                    </button>
                </div>
                <div className={styles.booksRow}>
                    {currentMonthBooks.map(book => (
                        <BookCard key={book.id} book={book} size="large" />
                    ))}
                </div>
            </section>

            {/* Notices */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>공지사항</h2>
                    <button className={styles.moreLink} onClick={() => navigate('/activities')}>
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className={styles.list}>
                    {recentNotices.map(notice => (
                        <div key={notice.id} className={styles.noticeCard} onClick={() => navigate('/activities')}>
                            <div className={styles.noticeIcon}>📢</div>
                            <div className={styles.noticeContent}>
                                <h3 className={styles.noticeTitle}>{notice.title}</h3>
                                <span className={styles.date}>{notice.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Activities */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>최신 활동</h2>
                </div>
                <div className={styles.list}>
                    {recentActivities.map(activity => (
                        <div key={activity.id} className={styles.activityCard}>
                            <div className={styles.activityHeader}>
                                <span className={styles.user}>{activity.user}</span>
                                <span className={styles.time}>{activity.timestamp}</span>
                            </div>
                            <p className={styles.activityText}>
                                {activity.bookTitle && <span className={styles.bookTag}>#{activity.bookTitle}</span>}
                                {activity.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
