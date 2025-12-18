import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // Mock events
    const events = [
        { date: new Date(2024, 0, 15), title: '토론 모임' },
        { date: new Date(2024, 0, 29), title: '토론 모임' },
        { date: new Date(2024, 0, 12), title: '과제 마감' },
    ];

    const getEventsForDay = (day) => {
        // Determine if event matches day. 
        // note: mock events are hardcoded for 2024-01.
        // Ideally compare year/month/day
        return events.filter(e => isSameDay(e.date, day));
    };

    return (
        <div className={styles.container}>
            {/* Calendar Header */}
            <div className={styles.header}>
                <button onClick={prevMonth} className={styles.navButton}><ChevronLeft size={24} /></button>
                <span className={styles.currentDate}>
                    {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                </span>
                <button onClick={nextMonth} className={styles.navButton}><ChevronRight size={24} /></button>
            </div>

            {/* Week Days */}
            <div className={styles.weekDays}>
                {weekDays.map(d => <div key={d} className={styles.weekDay}>{d}</div>)}
            </div>

            {/* Days Grid */}
            <div className={styles.grid}>
                {dayList.map((day, idx) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                        <div
                            key={day.toString()}
                            className={`
                ${styles.dayCell} 
                ${!isCurrentMonth ? styles.disabled : ''} 
                ${isSelected ? styles.selected : ''}
              `}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className={`${styles.dayNumber} ${isToday(day) ? styles.today : ''}`}>
                                {format(day, 'd')}
                            </span>
                            <div className={styles.dots}>
                                {dayEvents.map((evt, i) => (
                                    <span key={i} className={styles.dot} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Date Events */}
            <div className={styles.eventList}>
                <h3 className={styles.sectionTitle}>
                    {format(selectedDate, 'M월 d일 (EEE)', { locale: ko })} 일정
                </h3>
                {getEventsForDay(selectedDate).length > 0 ? (
                    getEventsForDay(selectedDate).map((evt, i) => (
                        <div key={i} className={styles.eventItem}>
                            <span className={styles.circle} />
                            {evt.title}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>일정이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
