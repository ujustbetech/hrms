import React from 'react';

const PolicyPage = () => {
    return (
        <div className="policy-container">
            <h1>Company Policies</h1>
            <ul>
                <li>
                    <a href="/erp.pdf" target="_blank" rel="noopener noreferrer">Policy 1 Title</a>
                </li>
                <li>
                    <a href="/path/to/policy2.pdf" target="_blank" rel="noopener noreferrer">Policy 2 Title</a>
                </li>
                <li>
                    <a href="/path/to/policy3.pdf" target="_blank" rel="noopener noreferrer">Policy 3 Title</a>
                </li>
                <li>
                    <a href="/path/to/policy4.pdf" target="_blank" rel="noopener noreferrer">Policy 4 Title</a>
                </li>
            </ul>
        </div>
    );
};

export default PolicyPage;
