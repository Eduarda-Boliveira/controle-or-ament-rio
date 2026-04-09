import { Header } from '../../organisms/Header/Header';
import { Footer } from '../../organisms/Footer/Footer';
import { SummaryCard } from '../../molecules/SummaryCard/SummaryCard';
import { Button } from '../../atoms/Button/Button';
import { Modal } from '../../atoms/Modal/Modal';
import { TransactionModal } from '../../organisms/TransactionModal/TransactionModal';
import { TransactionTable } from '../../organisms/TransactionTable/TransactionTable';
import { CategoryManager } from '../../organisms/CategoryManager/CategoryManager';
import { getBalance } from '../../../api/transactions';
import { listCategories } from '../../../api/categories';
import type { Category } from '../../../api/categories';
import { useState, useEffect } from 'react';
import styles from './DashboardTemplate.module.css';

interface DashboardTemplateProps {
  userName: string;
  userId: string;
  onLogout: () => void;
  onOpenTransactionModal: () => void;
  onOpenFilterModal: () => void;
  onOpenCategoryModal: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  isFilterModalOpen: boolean;
  onCloseFilterModal: () => void;
  isCategoryModalOpen: boolean;
  onCloseCategoryModal: () => void;
  startDate: string;
  endDate: string;
  selectedCategory: string;
  selectedPaymentMethod: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onPaymentMethodChange: (method: string) => void;
  onApplyFilters: () => void;
  onTransactionCreated: () => void;
  refreshTrigger: number;
}

export function DashboardTemplate({
  userName,
  userId,
  onLogout,
  onOpenTransactionModal,
  onOpenFilterModal,
  onOpenCategoryModal,
  isModalOpen,
  onCloseModal,
  isFilterModalOpen,
  onCloseFilterModal,
  isCategoryModalOpen,
  onCloseCategoryModal,
  startDate,
  endDate,
  selectedCategory,
  selectedPaymentMethod,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onPaymentMethodChange,
  onApplyFilters,
  onTransactionCreated,
  refreshTrigger,
}: DashboardTemplateProps) {
  const [balance, setBalance] = useState({ income: 0, expense: 0, balance: 0 });
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchBalance();
  }, [refreshTrigger]);

  useEffect(() => {
    if (isFilterModalOpen) {
      fetchCategories();
    }
  }, [isFilterModalOpen]);

  async function fetchCategories() {
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  async function fetchBalance() {
    try {
      setLoadingBalance(true);
      const data = await getBalance();
      setBalance(data);
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
    } finally {
      setLoadingBalance(false);
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDateInput(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos (ddmmaaaa)
    const limitedNumbers = numbers.slice(0, 8);
    
    // Adiciona as barras automaticamente
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 4) {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
    } else {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2, 4)}/${limitedNumbers.slice(4)}`;
    }
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatDateInput(e.target.value);
    onStartDateChange(formatted);
  }

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatDateInput(e.target.value);
    onEndDateChange(formatted);
  }

  return (
    <div className={styles.container}>
      <Header 
        userName={userName}
        onLogout={onLogout}
      />
      <div className={styles.content}>
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>Dashboard de Transações</h1>
            <div className={styles.headerButtons}>
              <button 
                className={styles.categoryButton}
                onClick={onOpenCategoryModal}
                title="Gerenciar Categorias"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button 
                className={styles.filterButton}
                onClick={onOpenFilterModal}
                title="Filtrar Transações"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5H21V6.5H3V4.5Z" fill="currentColor"/>
                  <path d="M7 11H17V13H7V11Z" fill="currentColor"/>
                  <path d="M11 17.5H13V19.5H11V17.5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          {(startDate && startDate.length === 10 && endDate && endDate.length === 10) && (
            <div className={styles.filterBanner}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#005db1" strokeWidth="2" fill="none"/>
                <path d="M12 7V13L15 15" stroke="#005db1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>
                Você está filtrando por transações do período{' '}
                <strong>{startDate}</strong> até{' '}
                <strong>{endDate}</strong>
              </span>
            </div>
          )}
          
          <div className={styles.cardsGrid}>
            <SummaryCard 
              title="Saldo Atual"
              value={loadingBalance ? 'Carregando...' : formatCurrency(balance.balance)}
            />
            
            <SummaryCard 
              title="Receitas"
              value={loadingBalance ? 'Carregando...' : formatCurrency(balance.income)}
            />
            
            <SummaryCard 
              title="Despesas"
              value={loadingBalance ? 'Carregando...' : formatCurrency(balance.expense)}
              valueColor="#c21020"
            />
          </div>
          
          <TransactionTable 
            userId={userId}
            startDate={startDate}
            endDate={endDate}
            categoryFilter={selectedCategory}
            paymentMethodFilter={selectedPaymentMethod}
            refreshTrigger={refreshTrigger}
            onTransactionDeleted={onTransactionCreated}
          />
      </div>
      
      <Button className={styles.floatingButton} onClick={onOpenTransactionModal}>
        <span>Nova Transação</span>
      </Button>
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={onCloseModal}
        onTransactionCreated={onTransactionCreated}
      />
      
      <Modal
        isOpen={isFilterModalOpen}
        onClose={onCloseFilterModal}
        title="Filtros de transações"
      >
        <div className={styles.filterModalContent}>
          <div className={styles.filterRow}>
            <div className={styles.filterColumn}>
              <label className={styles.filterLabel}>De</label>
              <input
                type="text"
                value={startDate}
                onChange={handleStartDateChange}
                className={styles.filterDateInput}
                placeholder="dd/mm/aaaa"
                maxLength={10}
              />
            </div>
            <div className={styles.filterColumn}>
              <label className={styles.filterLabel}>Até</label>
              <input
                type="text"
                value={endDate}
                onChange={handleEndDateChange}
                className={styles.filterDateInput}
                placeholder="dd/mm/aaaa"
                maxLength={10}
              />
            </div>
          </div>
          
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Categorias</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Método de Pagamento</label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos os métodos</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="boleto">Boleto</option>
              <option value="pix">PIX</option>
            </select>
          </div>
          
          <Button 
            className={styles.applyFiltersButton} 
            onClick={onApplyFilters}
          >
            <span>Aplicar Filtros</span>
          </Button>
        </div>
      </Modal>
      
      <CategoryManager 
        isOpen={isCategoryModalOpen}
        onClose={onCloseCategoryModal}
      />
      
      <Footer />
    </div>
  );
}
