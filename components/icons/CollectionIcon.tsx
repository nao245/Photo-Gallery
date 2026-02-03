
import React from 'react';

const CollectionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        strokeWidth="2" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
       <path d="M17 17v-12l-5 3l-5 -3v12l5 3z"></path>
       <path d="M12 21l-5 -3l-5 3v-12l5 -3l5 3"></path>
       <path d="M17 17l5 -3v-12l-5 3"></path>
    </svg>
);

export default CollectionIcon;
