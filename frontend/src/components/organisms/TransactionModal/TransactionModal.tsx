import { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { createTransaction } from '../../../api/transactions';
import { listCategories } from '../../../api/categories';
import type { Category } from '../../../api/categories';
import styles from './TransactionModal.module.css';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionCreated?: () => void;
}

export function TransactionModal({ isOpen, onClose, onTransactionCreated }: TransactionModalProps) {
  const [amount, setAmount] = useState('0,00');
  const [transactionDate, setTransactionDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  async function fetchCategories() {
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numberValue = parseFloat(value) / 100;
    setAmount(numberValue.toFixed(2).replace('.', ','));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    if (value.length >= 5) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setTransactionDate(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!transactionDate || transactionDate.length < 10) {
      setError('Data deve estar completa no formato DD/MM/AAAA');
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (amountValue <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);

      // Converter data de DD/MM/YYYY para YYYY-MM-DD (formato ISO)
      const [day, month, year] = transactionDate.split('/');
      
      if (!day || !month || !year || year.length !== 4) {
        throw new Error('Data inválida. Use o formato DD/MM/AAAA');
      }
      
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      await createTransaction({
        type: transactionType,
        amount: amountValue,
        description: description.trim(),
        date: isoDate,
        payment_method: paymentMethod,
        category_id: category ? parseInt(category) : null,
      });

      // Limpar formulário
      setAmount('0,00');
      setTransactionDate('');
      setDescription('');
      setCategory('');
      setPaymentMethod('dinheiro');
      setTransactionType('expense');

      // Notificar que a transação foi criada
      if (onTransactionCreated) {
        onTransactionCreated();
      }

      onClose();
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      const errorMessage = err.message || 'Erro ao salvar transação';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <div className={styles.amountContainer}>
            <div className={styles.amountIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8.5" cy="11" r="0.8" fill="currentColor"/>
                <circle cx="12" cy="11" r="0.8" fill="currentColor"/>
                <circle cx="15.5" cy="11" r="0.8" fill="currentColor"/>
                <circle cx="8.5" cy="14" r="0.8" fill="currentColor"/>
                <circle cx="12" cy="14" r="0.8" fill="currentColor"/>
                <circle cx="15.5" cy="14" r="0.8" fill="currentColor"/>
                <circle cx="8.5" cy="17" r="0.8" fill="currentColor"/>
                <circle cx="12" cy="17" r="0.8" fill="currentColor"/>
                <circle cx="15.5" cy="17" r="0.8" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="text"
              className={styles.amountInput}
              value={`R$ ${amount}`}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <select
              className={styles.selectInput}
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="13" r="0.8" fill="currentColor"/>
                <circle cx="12" cy="13" r="0.8" fill="currentColor"/>
                <circle cx="16" cy="13" r="0.8" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="text"
              className={styles.textInput}
              placeholder="DD/MM/AAAA"
              value={transactionDate}
              onChange={handleDateChange}
              maxLength={10}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {categories.length > 0 ? (
              <select
                className={styles.selectInput}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={styles.textInput}
                placeholder="Categoria (opcional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <select
              className={styles.selectInput}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="boleto">Boleto</option>
              <option value="pix">PIX</option>
            </select>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
