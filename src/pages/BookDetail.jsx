import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PenTool, Link as LinkIcon, Download } from 'lucide-react';
import styles from './BookDetail.module.css';
import TabNavigation from '../components/common/TabNavigation';
import { BOOKS } from '../data/mockData';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');

    const book = useMemo(() => {
        for (const month of BOOKS) {
            const found = month.items.find(b => b.id === id);
            if (found) return found;
        }
        return null;
    }, [id]);

    if (!book) {
        return <div className="container">Book not found</div>;
    }

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
                    <img src={book.coverUrl} alt={book.title} className={styles.cover} />
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
                        <p>이 책은 {book.title}입니다. {book.author}의 대표작으로...</p>
                        <div className={styles.emptyState}>상세 내용 준비 중</div>
                    </div>
                )}
                {activeTab === 'discussion' && (
                    <div className={styles.tabList}>
                        <div className={styles.listItem}>
                            <div className={styles.listIcon}><MessageCircle size={20} /></div>
                            <div>
                                <h4>이번 주 발제: 핵심 주제에 대해</h4>
                                <span className={styles.meta}>운영자 · 댓글 5</span>
                            </div>
                        </div>
                        <div className={styles.listItem}>
                            <div className={styles.listIcon}><MessageCircle size={20} /></div>
                            <div>
                                <h4>3챕터 질문있습니다.</h4>
                                <span className={styles.meta}>김철수 · 댓글 2</span>
                            </div>
                        </div>
                        <button className={styles.fab}>
                            <PenTool size={24} />
                        </button>
                    </div>
                )}
                {activeTab === 'review' && (
                    <div className={styles.tabList}>
                        <div className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.reviewer}>이영희</span>
                                <span className={styles.stars}>★★★★★</span>
                            </div>
                            <p>정말 많은 인사이트를 얻었습니다. 추천합니다!</p>
                        </div>
                    </div>
                )}
                {activeTab === 'materials' && (
                    <div className={styles.tabList}>
                        <div className={styles.listItem}>
                            <div className={styles.listIcon}><Download size={20} /></div>
                            <div>
                                <h4>요약본 PDF</h4>
                                <span className={styles.meta}>2.3MB</span>
                            </div>
                        </div>
                        <div className={styles.listItem}>
                            <div className={styles.listIcon}><LinkIcon size={20} /></div>
                            <div>
                                <h4>저자 인터뷰 영상</h4>
                                <span className={styles.meta}>Youtube</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetail;
