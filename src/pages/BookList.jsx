import React, { useRef, useEffect, useState } from 'react';
import styles from './BookList.module.css';
import BookCard from '../components/features/BookCard';
import { fetchBooks } from '../services/bookService';

const BookList = () => {
    const [booksByMonth, setBooksByMonth] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const books = await fetchBooks(2026);

                // Group by month
                const grouped = books.reduce((acc, book) => {
                    const month = book.month;
                    if (!acc[month]) {
                        acc[month] = { month, items: [] };
                    }
                    acc[month].items.push(book);
                    return acc;
                }, {});

                // Convert to array and sort
                const sorted = Object.values(grouped).sort((a, b) => a.month - b.month);
                setBooksByMonth(sorted);
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };
        loadBooks();
    }, []);

    if (loading) return <div className={styles.container}>로딩 중...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>2026년 독서 일정</h2>
                <p className={styles.pageSubtitle}>월별 선정 도서와 함께 성장하세요</p>
            </header>

            <div className={styles.timeline}>
                {booksByMonth.length === 0 ? (
                    <div className={styles.empty}>등록된 도서가 없습니다.</div>
                ) : (
                    booksByMonth.map((monthData) => (
                        <div key={monthData.month} className={styles.monthSection} id={`month-${monthData.month}`}>
                            <div className={styles.monthLabel}>
                                <span className={styles.monthNumber}>{monthData.month}월</span>
                            </div>
                            <div className={styles.bookGrid}>
                                {monthData.items.map((book) => (
                                    <BookCard key={book.id} book={book} size="normal" />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookList;

