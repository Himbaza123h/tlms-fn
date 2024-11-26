import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import styles from '../../styles/components/Breadcrumbs.module.scss';

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav className={styles.breadcrumbs}>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className={styles.breadcrumbItem}>
          {/* Icon for the first breadcrumb */}
          {index === 0 && breadcrumb.icon && (
            <span className={styles.icon}>{breadcrumb.icon}</span>
          )}

          {/* Link or current page */}
          {index < breadcrumbs.length - 1 ? (
            <Link 
              href={breadcrumb.link} 
              className={styles.link}
            >
              {breadcrumb.name}
            </Link>
          ) : (
            <span className={styles.currentPage}>
              {breadcrumb.name}
            </span>
          )}

          {/* Separator */}
          {index < breadcrumbs.length - 1 && (
            <span className={styles.separator}>
              <ChevronRightIcon size={18} strokeWidth={2.5} />
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;