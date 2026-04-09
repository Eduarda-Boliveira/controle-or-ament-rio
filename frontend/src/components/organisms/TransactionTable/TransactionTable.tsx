import { useState, useEffect } from 'react';
import { Table } from '../../atoms/Table/Table';
import { listTransactions, deleteTransaction } from '../../../api/transactions';
import styles from './TransactionTable.module.css';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: 'receita' | 'despesa' | 'cartao_credito';
  paymentMethod: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface TransactionTableProps {
  userId: string;
  startDate?: string;
  endDate?: string;
  categoryFilter?: string;
  paymentMethodFilter?: string;
  refreshTrigger?: number;
  onTransactionDeleted?: () => void;
}

export function TransactionTable({ userId, startDate, endDate, categoryFilter, paymentMethodFilter, refreshTrigger, onTransactionDeleted }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [userId, startDate, endDate, categoryFilter, paymentMethodFilter, refreshTrigger]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError(null);
      
      // Só aplica filtro de data se ambos os campos estiverem completos
      const shouldApplyDateFilter = 
        startDate && startDate.length === 10 && 
        endDate && endDate.length === 10;
      
      const apiTransactions = await listTransactions({
        startDate: shouldApplyDateFilter ? startDate : undefined,
        endDate: shouldApplyDateFilter ? endDate : undefined,
        category_id: categoryFilter && categoryFilter !== 'all' ? parseInt(categoryFilter) : undefined,
      });
      
      // Converter o formato da API para o formato do componente
      let formattedTransactions = apiTransactions.map(t => ({
        id: t.id,
        date: t.date,
        amount: typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount,
        type: t.type === 'income' ? 'receita' as const : 'despesa' as const,
        paymentMethod: t.paymentMethod,
        description: t.description,
        category: t.category,
      }));
      
      // Aplicar filtros do cliente
      if (paymentMethodFilter && paymentMethodFilter !== 'all') {
        formattedTransactions = formattedTransactions.filter(transaction => transaction.paymentMethod === paymentMethodFilter);
      }
      
      setTransactions(formattedTransactions);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      setError(err.message || 'Erro ao buscar transações');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(key: string) {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      boleto: 'Boleto',
      pix: 'PIX',
    };
    return labels[method] || method;
  }

  function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      receita: 'Receita',
      despesa: 'Despesa',
      cartao_credito: 'Cartão'
    };
    return labels[type] || type;
  }

  function handleEdit(_id: number) {
    
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      await deleteTransaction(id);
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir transação');
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: any = a[sortColumn as keyof Transaction];
    let bValue: any = b[sortColumn as keyof Transaction];

    if (sortColumn === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }

    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns = [
    {
      key: 'date',
      header: 'Data da Transação',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'amount',
      header: 'Valor da Transação',
      sortable: true,
      render: (value: number, row: Transaction) => (
        <span
          className={row.type === 'receita' ? styles.positiveAmount : styles.negativeAmount}
        >
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Categoria',
      sortable: true,
      render: (_value: any, row: Transaction) => row.category?.name || '-',
    },
    {
      key: 'paymentMethod',
      header: 'Método de Pagamento',
      sortable: true,
      render: (value: string) => getPaymentMethodLabel(value),
    },
    {
      key: 'type',
      header: 'Tipo',
      sortable: true,
      render: (value: string, row: Transaction) => {
        const typeClass = row.type === 'receita' 
          ? styles.typeRevenue 
          : row.type === 'despesa' 
          ? styles.typeExpense 
          : styles.typeCredit;
        return (
          <span className={typeClass}>
            {getTypeLabel(value)}
          </span>
        );
      },
    },
    {
      key: 'description',
      header: 'Descrição',
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      key: 'actions',
      header: 'Ações',
      sortable: false,
      render: (_value: any, row: Transaction) => (
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => handleEdit(row.id)}
            title="Editar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => handleDelete(row.id)}
            title="Excluir"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando transações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Erro: {error}</p>
        <button onClick={fetchTransactions} className={styles.retryButton}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={sortedTransactions}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    </div>
  );
}
