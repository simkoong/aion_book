import React, { useState } from 'react';
import styles from './WriteActivityForm.module.css';
import { createActivity } from '../../services/activityService';

const WriteActivityForm = ({ category, book, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content || !userName) return;
        if (category === 'discussion' && !title) return;

        setSubmitting(true);
        try {
            await createActivity({
                category,
                title: category === 'discussion' ? title : `${book.title} 후기`,
                content,
                user_name: userName,
                book_title: book.title,
                book_id: book.id  // sending book_id to link
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create activity', error);
            alert('등록에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>
                    {category === 'discussion' ? '토론 발제하기' : '후기 남기기'}
                </h3>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>이름 (닉네임)</label>
                        <input
                            className={styles.input}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </div>

                    {category === 'discussion' && (
                        <div className={styles.field}>
                            <label className={styles.label}>제목</label>
                            <input
                                className={styles.input}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="토론 주제를 입력하세요"
                                required
                            />
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>내용</label>
                        <textarea
                            className={styles.textarea}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={category === 'discussion' ? '토론하고 싶은 내용을 자유롭게 적어주세요.' : '책을 읽고 느낀 점을 기록해보세요.'}
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
                        <button type="submit" disabled={submitting} className={styles.submitButton}>
                            {submitting ? '등록 중...' : '등록하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WriteActivityForm;
