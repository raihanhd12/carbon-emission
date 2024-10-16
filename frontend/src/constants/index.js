// Dummy sellers data
export const DUMMY_SELLERS = [
    { id: '1', name: 'Eco Solutions Inc.', emissionAmount: 600, verifiedAmount: 500, status: 'verified' },
    { id: '2', name: 'Green Energy Co.', emissionAmount: 800, verifiedAmount: null, status: 'pending' },
    { id: '3', name: 'Sustainable Futures', emissionAmount: 450, verifiedAmount: 450, status: 'verified' },
    { id: '4', name: 'CleanTech Industries', emissionAmount: 700, verifiedAmount: null, status: 'pending' },
    { id: '5', name: 'EcoFriendly Solutions', emissionAmount: 550, verifiedAmount: 500, status: 'verified' },
];

// Maximum sellers to display
export const MAX_DISPLAY_SELLERS = 5;

// Status colors for different seller statuses
export const STATUS_COLORS = {
    verified: 'text-green-400',
    pending: 'text-yellow-400',
    rejected: 'text-red-400',
};
