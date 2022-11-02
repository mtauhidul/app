import React from 'react';

import './style.less';

export default ({ left, children, className = '' }) => (
    <div className={`content-frame ${className}`}>
        <div className="left-content">
            {left}
        </div>
        <div className="right-content">
            {children}
        </div>
    </div>
)
