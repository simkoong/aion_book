import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Home.module.css';
import BookCard from '../components/features/BookCard';
import { fetchBooks } from '../services/bookService';
import { fetchActivities } from '../services/activityService';

const Home = () => {
    const navigate = useNavigate();
    // Use current date for month logic
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear(); // e.g., 2026 for this project context

    // States
    const [monthBooks, setMonthBooks] = useState([]);
    const [recentNotices, setRecentNotices] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                // 1. Fetch this month's books
                const allBooks = await fetchBooks(2026); // Hardcoded year as per project context
                const foundMonth = allBooks.filter(b => b.month === currentMonth || b.month === 1); // Fallback to Jan if current empty or logic needed
                // Better: Grouping logic similar to BookList or just filter by current month
                const thisMonthBooks = allBooks.filter(b => b.month === 1); // For demo, let's show Jan books if current is technically Dec 2025
                // Actually, let's use the requested year context (2026)
                // If today is Dec 2025, let's show Jan 2026 books as "Upcoming" or "Current" context

                setMonthBooks(thisMonthBooks);

                // 2. Fetch recent notices (limit 3)
                const notices = await fetchActivities('notice', 3);
                setRecentNotices(notices);

                // 3. Fetch recent activities (limit 3, excluding notices ideally, or just all)
                // Let's fetch 'all' excluding notices if possible, or just mixed. 
                // UI shows 'Recent Activities', usually user discussions/reviews
                // For now, let's fetch 'discussion' and 'review' combined or just general 'all' minus 'notice'?
                // The service simple 'all' includes notices. Let's just fetch 'all' for now or specific categories if user prefers.
                // Given the mockup usually separates Notices, let's try to fetch discussions/reviews.
                // Since our service doesn't support complex NOT IN, let's fetch 'all' with limit 5 and filter client side or just fetch discussion/review separately.
                // Let's simplified: fetch 'discussion' for now as "Recent Activities" usually implies user interaction.
                const activities = await fetchActivities('all', 3);
                // Filter out notices from activities list if duplicates concern, but 'all' is fine for "Recent"
                setRecentActivities(activities.filter(a => a.category !== 'notice').slice(0, 3));

            } catch (err) {
                console.error("Failed to load home data", err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    if (loading) return <div className={styles.container}>로딩 중...</div>;

    return (
        <div className={styles.container}>
            {/* This Month's Books (Jan 2026 for Demo) */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.highlight}>
                            {monthBooks.length > 0 ? `${monthBooks[0].year}년 ${monthBooks[0].month}월` : '이달'}
                        </span>의 책
                    </h2>
                    <button className={styles.moreLink} onClick={() => navigate('/books')}>
                        전체보기 <ChevronRight size={16} />
                    </button>
                </div>
                <div className={styles.booksRow}>
                    {monthBooks.length > 0 ? (
                        monthBooks.map(book => (
                            <BookCard key={book.id} book={book} size="large" />
                        ))
                    ) : (
                        <div>이달의 도서가 없습니다.</div>
                    )}
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
                    {recentNotices.length === 0 ? (
                        <div className={styles.emptyState}>등록된 공지사항이 없습니다.</div>
                    ) : (
                        recentNotices.map(notice => (
                            <div key={notice.id} className={styles.noticeCard} onClick={() => navigate('/activities')}>
                                <div className={styles.noticeIcon}>📢</div>
                                <div className={styles.noticeContent}>
                                    <h3 className={styles.noticeTitle}>{notice.title}</h3>
                                    <span className={styles.date}>{new Date(notice.created_at).toLocaleDateString()}</span>
                                    <p className={styles.activityText} style={{ marginTop: '4px', fontSize: '0.9em' }}>{notice.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Recent Activities */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>최신 활동</h2>
                </div>
                <div className={styles.list}>
                    {recentActivities.length === 0 ? (
                        <div className={styles.emptyState}>최신 활동이 없습니다.</div>
                    ) : (
                        recentActivities.map(activity => {
                            const categoryLabels = {
                                discussion: '💬 토론',
                                review: '⭐ 후기',
                                notice: '📢 공지',
                                question: '❓ 질문',
                                assignment: '📝 과제'
                            };
                            return (
                                <div key={activity.id} className={styles.activityCard}>
                                    <div className={styles.activityHeader}>
                                        <div className={styles.headerLeft}>
                                            <span className={styles.categoryBadge}>{categoryLabels[activity.category] || '활동'}</span>
                                            <span className={styles.user}>{activity.user_name}</span>
                                        </div>
                                        <span className={styles.time}>{new Date(activity.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className={styles.activityText}>
                                        {activity.book_title && <span className={styles.bookTag}>#{activity.book_title}</span>}
                                        {activity.content}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
