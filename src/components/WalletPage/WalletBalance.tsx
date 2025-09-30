import React from 'react';

interface WalletBalanceProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, onDeposit, onWithdraw }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Balance</h2>
      
      <div className="mb-6">
        <span className="text-4xl font-bold text-green-600">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onDeposit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Deposit Funds
        </button>
        
        <button
          onClick={onWithdraw}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default WalletBalance;