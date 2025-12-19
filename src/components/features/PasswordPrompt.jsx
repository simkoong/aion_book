import React, { useState } from 'react';
import styles from './WriteActivityForm.module.css'; // Reusing styles for consistency
import { hashPassword } from '../../utils/crypto';

const PasswordPrompt = ({ onClose, onConfirm }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        try {
            const hash = await hashPassword(password);
            await onConfirm(hash);
        } catch (error) {
            console.error('Validation failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '400px' }}>
                <h3 className={styles.title}>비밀번호 확인</h3>
                <p style={{ marginBottom: '16px', color: '#666' }}>글을 삭제하려면 비밀번호를 입력하세요.</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            required
                            autoFocus
                        />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
                        <button type="submit" disabled={loading} className={styles.submitButton} style={{ backgroundColor: '#ef4444' }}>
                            {loading ? '확인 중...' : '삭제하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordPrompt;
