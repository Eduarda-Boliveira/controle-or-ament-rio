import { useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import { DashboardTemplate } from '../../templates/DashboardTemplate/DashboardTemplate';

interface DashboardPageProps {
  user: {
    userId: string;
    username: string;
    displayName?: string;
    attributes?: {
      name?: string;
      email?: string;
      [key: string]: any;
    };
  };
  onLogout: () => void;
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  async function handleLogout() {
    try {
      await signOut();
      onLogout();
    } catch (error) {
    }
  }

  function handleTransactionCreated() {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <DashboardTemplate
      userName={user?.displayName || user?.username}
      userId={user.userId}
      onLogout={handleLogout}
      onOpenTransactionModal={() => setIsModalOpen(true)}
      onOpenFilterModal={() => setIsFilterModalOpen(true)}
      onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      isModalOpen={isModalOpen}
      onCloseModal={() => setIsModalOpen(false)}
      isFilterModalOpen={isFilterModalOpen}
      onCloseFilterModal={() => setIsFilterModalOpen(false)}
      isCategoryModalOpen={isCategoryModalOpen}
      onCloseCategoryModal={() => setIsCategoryModalOpen(false)}
      startDate={startDate}
      endDate={endDate}
      selectedCategory={selectedCategory}
      selectedPaymentMethod={selectedPaymentMethod}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onCategoryChange={setSelectedCategory}
      onPaymentMethodChange={setSelectedPaymentMethod}
      onApplyFilters={() => setIsFilterModalOpen(false)}
      onTransactionCreated={handleTransactionCreated}
      refreshTrigger={refreshTrigger}
    />
  );
}
