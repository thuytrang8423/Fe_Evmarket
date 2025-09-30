import React, { useState, useMemo } from 'react';
import { useI18nContext } from '@/providers/I18nProvider';

interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  filter: string;
  onFilterChange: (filter: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  filter, 
  onFilterChange 
}) => {
  const { t } = useI18nContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions based on filter
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    // Add more specific filtering logic here if needed
    return transactions;
  }, [transactions, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{t('wallet.transactionHistory')}</h2>
        
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 min-w-0 text-black"
        >
          <option value="all">All Transactions</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="purchase">Purchases</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">{t('wallet.date')}</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">{t('wallet.type')}</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">{t('wallet.description')}</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">{t('wallet.amount')}</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">{t('wallet.status')}</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600">{transaction.date}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                  <div className="truncate max-w-[80px] sm:max-w-none" title={transaction.type}>
                    {transaction.type}
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                  <div className="truncate max-w-[150px]" title={transaction.description}>
                    {transaction.description}
                  </div>
                </td>
                <td className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium ${getAmountColor(transaction.amount)}`}>
                  <div className="truncate">
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4">
                  <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                    <span className="truncate max-w-[60px] sm:max-w-none">{transaction.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3 text-xs sm:text-sm text-gray-600">
        <span className="text-center sm:text-left">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </span>
        <div className="flex gap-1 justify-center sm:justify-end">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs sm:text-sm ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {t('wallet.previous')}
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs sm:text-sm ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {t('wallet.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;