import React from 'react';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'bank' | 'paypal';
  name: string;
  details: string;
  isDefault?: boolean;
}

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onManagePaymentMethods: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  paymentMethods, 
  onManagePaymentMethods 
}) => {
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
        );
      case 'bank':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
          </div>
        );
      case 'paypal':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
          </div>
        );
    }
  };

  const getStatusIndicator = (isDefault?: boolean) => {
    if (isDefault) {
      return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
    }
    return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
        <button
          onClick={onManagePaymentMethods}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Manage Payment Methods
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {getPaymentMethodIcon(method.type)}
              <div>
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.details}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIndicator(method.isDefault)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;