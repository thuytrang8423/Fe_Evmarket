import React from 'react';
import { useI18nContext } from '@/providers/I18nProvider';

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
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 line-clamp-2">{t('wallet.auctionFundsHold')}</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 break-all">
            ${holdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex items-start gap-2 p-2 bg-yellow-100 rounded-md border-l-4 border-yellow-400">
         
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">{t('wallet.importantNote')}</p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              {t('wallet.warningMessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccrualFundsHold;