import React, { useState } from 'react';
import styles from './WriteActivityForm.module.css';
import { createActivity } from '../../services/activityService';
import { hashPassword } from '../../utils/crypto';

const WriteActivityForm = ({ category, book, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content || !userName || !password) return;
        if ((category === 'discussion' || category === 'notice') && !title) return;

        // Notice author validation
        if (category === 'notice') {
            const allowedNames = ['AION', '오리', '유하'];
            if (!allowedNames.includes(userName)) {
                alert('공지사항은 관리자(AION, 오리, 유하)만 작성할 수 있습니다.');
                return;
            }
        }

        setSubmitting(true);
        try {
            const passwordHash = await hashPassword(password);
            await createActivity({
                category,
                title: (category === 'discussion' || category === 'notice') ? title : `${book?.title || '활동'} 후기`,
                content,
                user_name: userName,
                password: passwordHash,
                book_title: book?.title || null,
                book_id: book?.id || null
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
                    {category === 'discussion' ? '토론 발제하기' : category === 'notice' ? '공지사항 등록' : '후기 남기기'}
                </h3>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>이름 (닉네임)</label>
                        <input
                            className={styles.input}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder={category === 'notice' ? "관리자 이름 (AION, 오리, 유하)" : "이름을 입력하세요"}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>비밀번호 (삭제 시 필요)</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 입력 (최대 20자)"
                            maxLength={20}
                            required
                        />
                    </div>

                    {(category === 'discussion' || category === 'notice') && (
                        <div className={styles.field}>
                            <label className={styles.label}>제목</label>
                            <input
                                className={styles.input}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
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
                            placeholder="내용을 입력하세요."
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
