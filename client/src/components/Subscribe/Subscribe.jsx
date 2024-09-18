import React from 'react';

import styles from './Subscribe.module.css';

const Subsribe = () => {
  return (
    <div className={styles['subscribe']}>
      <div className={styles['container']}>
        <h2>Save time, save money!</h2>
        <p>Sign up and we'll send the best deals to you</p>
        <form className={styles['form']}>
          <input type='email' placeholder='Your Email' />
          <button type='submit'>Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default Subsribe;
