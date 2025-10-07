import React from 'react';
import { useI18nContext } from '@/providers/I18nProvider';
import { formatCurrency } from '@/services';

interface AccrualFundsHoldProps {
  holdAmount: number;
  description: string;
}

const AccrualFundsHold: React.FC<AccrualFundsHoldProps> = ({ 
  holdAmount, 
  description 
}) => {
  const { t } = useI18nContext();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{t('wallet.auctionFundsHold')}</h2>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 block">
                {formatCurrency(holdAmount)}
              </span>
              <p className="text-amber-700 text-sm font-medium">Số tiền tạm giữ</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-900 mb-2">
                💡 {t('wallet.importantNote')}
              </p>
              <p className="text-sm text-blue-700 leading-relaxed">
                {t('wallet.warningMessage')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccrualFundsHold;