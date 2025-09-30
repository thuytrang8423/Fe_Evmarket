import React, { useState } from 'react';
import { useI18nContext } from '@/providers/I18nProvider';
import TransactionHistory from './TransactionHistory';
import AccrualFundsHold from './AccrualFundsHold';

function WalletManagement() {
  const { t } = useI18nContext();
  const [transactionFilter, setTransactionFilter] = useState('all');

  // Sample data - trong thực tế sẽ fetch từ API
  const mockTransactions = [
    {
      id: '1',
      date: '2024-01-20',
      type: 'Deposit',
      description: 'Bank Transfer',
      amount: 500.00,
      status: 'Completed' as const
    },
    {
      id: '2',
      date: '2024-01-19',
      type: 'Auction Bid',
      description: 'Tesla Model S bid',
      amount: -1500.00,
      status: 'Pending' as const
    },
    {
      id: '3',
      date: '2024-01-18',
      type: 'Withdraw',
      description: 'Withdraw to bank account',
      amount: -200.00,
      status: 'Completed' as const
    },
    {
      id: '4',
      date: '2024-01-17',
      type: 'Purchase',
      description: 'Nissan Leaf Purchase',
      amount: -25000.00,
      status: 'Completed' as const
    },
    {
      id: '5',
      date: '2024-01-16',
      type: 'Refund',
      description: 'Charge Card Refund',
      amount: 1500.00,
      status: 'Completed' as const
    },
    {
      id: '6',
      date: '2024-01-15',
      type: 'Deposit',
      description: 'Credit Card Deposit',
      amount: 1000.00,
      status: 'Completed' as const
    },
    {
      id: '7',
      date: '2024-01-14',
      type: 'Auction Bid',
      description: 'BMW i3 auction bid',
      amount: -800.00,
      status: 'Failed' as const
    },
    {
      id: '8',
      date: '2024-01-13',
      type: 'Purchase',
      description: 'Battery Pack for Model Y',
      amount: -3500.00,
      status: 'Completed' as const
    },
    {
      id: '9',
      date: '2024-01-12',
      type: 'Deposit',
      description: 'PayPal Transfer',
      amount: 750.00,
      status: 'Completed' as const
    },
    {
      id: '10',
      date: '2024-01-11',
      type: 'Auction Bid',
      description: 'VinFast VF8 bid',
      amount: -2200.00,
      status: 'Pending' as const
    },
    {
      id: '11',
      date: '2024-01-10',
      type: 'Withdraw',
      description: 'ATM Withdrawal',
      amount: -100.00,
      status: 'Completed' as const
    },
    {
      id: '12',
      date: '2024-01-09',
      type: 'Purchase',
      description: 'Tesla Charging Cable',
      amount: -250.00,
      status: 'Completed' as const
    },
    {
      id: '13',
      date: '2024-01-08',
      type: 'Deposit',
      description: 'Wire Transfer',
      amount: 2000.00,
      status: 'Completed' as const
    },
    {
      id: '14',
      date: '2024-01-07',
      type: 'Auction Bid',
      description: 'Hyundai Kona Electric bid',
      amount: -1800.00,
      status: 'Failed' as const
    },
    {
      id: '15',
      date: '2024-01-06',
      type: 'Purchase',
      description: 'EV Home Charger',
      amount: -800.00,
      status: 'Completed' as const
    },
    {
      id: '16',
      date: '2024-01-05',
      type: 'Refund',
      description: 'Cancelled Order Refund',
      amount: 600.00,
      status: 'Completed' as const
    },
    {
      id: '17',
      date: '2024-01-04',
      type: 'Deposit',
      description: 'Check Deposit',
      amount: 1200.00,
      status: 'Pending' as const
    },
    {
      id: '18',
      date: '2024-01-03',
      type: 'Auction Bid',
      description: 'Chevrolet Bolt bid',
      amount: -1600.00,
      status: 'Completed' as const
    },
    {
      id: '19',
      date: '2024-01-02',
      type: 'Purchase',
      description: 'Replacement Battery Cell',
      amount: -450.00,
      status: 'Completed' as const
    },
    {
      id: '20',
      date: '2024-01-01',
      type: 'Deposit',
      description: 'New Year Bonus',
      amount: 5000.00,
      status: 'Completed' as const
    }
  ];

  const handleDeposit = () => {
    console.log('Deposit funds clicked');
    // Implement deposit logic
  };

  const handleWithdraw = () => {
    console.log('Withdraw clicked');
    // Implement withdraw logic
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('wallet.management')}</h1>
          <p className="text-gray-600">{t('wallet.manageDescription')}</p>
        </div>

        {/* Main Grid Layout - 1:2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column (1/3) - Balance and Funds Hold */}
          <div className="xl:col-span-1 space-y-6">
            {/* Wallet Balance Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t('wallet.currentBalance')}</h2>
              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-bold text-green-600 break-all">
                  ${(2847.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeposit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors w-full text-sm sm:text-base"
                >
                  {t('wallet.depositFunds')}
                </button>
                
                <button
                  onClick={handleWithdraw}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors w-full text-sm sm:text-base"
                >
                  {t('wallet.withdraw')}
                </button>
              </div>
            </div>

            {/* Accrual Funds Hold */}
            <AccrualFundsHold
              holdAmount={2000.00}
              description={t('wallet.lockedDescription')}
            />
          </div>

          {/* Right Column (2/3) - Transaction History */}
          <div className="xl:col-span-2">
            <TransactionHistory
              transactions={mockTransactions}
              filter={transactionFilter}
              onFilterChange={setTransactionFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletManagement;