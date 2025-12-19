import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookCard.module.css';

const BookCard = ({ book, size = 'normal' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/books/${book.id}`);
    };

    return (
        <div className={`${styles.card} ${styles[size]}`} onClick={handleClick}>
            <div className={styles.coverWrapper}>
                <img src={book.coverUrl || book.cover_url} alt={book.title} className={styles.cover} loading="lazy" />
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{book.title}</h3>
                <p className={styles.author}>{book.author}</p>
            </div>
        </div>
    );
};

export default BookCard;
