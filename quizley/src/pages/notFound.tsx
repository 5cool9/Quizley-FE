import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50"> 
            <p className="text-lg text-gray-600 mb-8"> 잘못된 페이지입니다.</p>
        </div>
    );
};

export default NotFoundPage;