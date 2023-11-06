import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(path => path);

    return (
        <div>
            {paths.map((path, index) => {
                const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;

                return (
                    <span key={path}>
                        <Link to={routeTo}>{path}</Link>
                        {!isLast && <span> &gt; </span>}
                    </span>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
