import React, { useState } from 'react';
import { useI18nContext } from '@/providers/I18nProvider';
import { makeDeposit, formatCurrency, openPaymentUrl, DepositResponse } from '@/services';
import { useToast } from '@/hooks/useToast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDepositSuccess }) => {
  const { t } = useI18nContext();
  const { success, error } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Preset amounts in VND
  const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleDeposit = async () => {
    const depositAmount = parseInt(amount);
    
    if (!depositAmount || depositAmount < 10000) {
      error(t('wallet.minimumAmount'));
      return;
    }

    if (depositAmount > 50000000) {
      error(t('wallet.maximumAmount'));
      return;
    }

    setIsLoading(true);
    
    try {
      const response: DepositResponse = await makeDeposit({ amount: depositAmount });
      
      if (response.data.resultCode === 0) {
        // Success - redirect to payment
        success(t('wallet.depositRequestCreated'));
        
        // Open payment URL in new tab
        openPaymentUrl(response.data.payUrl);
        
        // Close modal and refresh wallet data
        onClose();
        onDepositSuccess();
        
        // Reset form
        setAmount('');
      } else {
        error(response.data.message || t('wallet.depositFailed'));
      }
    } catch (err) {
      console.error('Deposit error:', err);
      error(t('wallet.depositError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] shadow-2xl transform transition-all duration-300 scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('wallet.depositFunds')}
              </h3>
              <p className="text-green-100 text-base">
                {t('wallet.depositDescription', 'Nạp tiền vào ví để tham gia đấu giá')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors p-3 hover:bg-white/20 rounded-full flex-shrink-0"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Amount Input */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-800">
                {t('wallet.depositAmount')}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Nhập số tiền"
                  className="w-full px-6 py-5 text-black text-2xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300"
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-base">
                  VND
                </div>
              </div>
              {amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-base text-blue-800 font-medium">
                    💰 {t('wallet.depositAmountDisplay')}: <span className="font-bold text-lg">{formatCurrency(parseInt(amount))}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Preset Amounts */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-800">
                {t('wallet.quickAmount')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {presetAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    onClick={() => handlePresetAmount(presetAmount)}
                    className={`relative px-6 py-4 text-base font-semibold rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      amount === presetAmount.toString()
                        ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                    }`}
                    disabled={isLoading}
                  >
                    {formatCurrency(presetAmount)}
                    {amount === presetAmount.toString() && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-blue-900 mb-2">
                    🔐 {t('wallet.paymentInfo')}
                  </h4>
                  <p className="text-base text-blue-700 leading-relaxed mb-3">
                    {t('wallet.paymentInfoDescription')}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <span className="text-sm font-medium text-blue-800">MoMo Payment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Amount Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-800 font-medium">
                  {t('wallet.minimumAmountNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-8 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all duration-200 transform hover:scale-105 text-base"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDeposit}
              disabled={!amount || parseInt(amount) < 10000 || isLoading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg shadow-green-500/25 disabled:shadow-none flex items-center justify-center space-x-2 text-base"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('wallet.processing')}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{t('wallet.proceedToPayment')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;