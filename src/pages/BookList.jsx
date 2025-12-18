import React, { useRef, useEffect } from 'react';
import styles from './BookList.module.css';
import BookCard from '../components/features/BookCard';
import { BOOKS } from '../data/mockData';

const BookList = () => {
    const scrollRef = useRef(null);

    // Auto-scroll to current month? (Optional)
    useEffect(() => {
        // Logic to scroll to current month could go here
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>2026년 독서 일정</h2>
                <p className={styles.pageSubtitle}>월별 선정 도서와 함께 성장하세요</p>
            </header>

            <div className={styles.timeline}>
                {BOOKS.map((monthData) => (
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
                ))}
            </div>
        </div>
    );
};

export default BookList;
