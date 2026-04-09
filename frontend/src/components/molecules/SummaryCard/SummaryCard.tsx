import { Card } from '../../atoms/Card/Card';
import styles from './SummaryCard.module.css';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  className?: string;
  valueColor?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  subtitleValue,
  className = '',
  valueColor
}: SummaryCardProps) {
  return (
    <Card className={className}>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value} style={valueColor ? { color: valueColor } : undefined}>
          {value}
        </p>
        {subtitle && subtitleValue !== undefined && (
          <div className={styles.subtitleRow}>
            <span className={styles.subtitle}>{subtitle}</span>
            <span className={styles.subtitleValue}>{subtitleValue}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
