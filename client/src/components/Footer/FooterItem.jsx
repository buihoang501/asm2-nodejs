import React from 'react';
import styles from './Footer.module.css';
const FooterItem = (props) => {
  //Get footer prop
  const footer = props.footer;
  return (
    <div className={styles['footer']}>
      {/*Map throguh footer data*/}
      {footer.map((col) => (
        <ul key={col.col_number}>
          {/*Map through  col values array*/}
          {col.col_values.map((value) => (
            <li key={value}>
              <a href='#'>{value}</a>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default FooterItem;
