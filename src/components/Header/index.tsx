import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews" />
        <nav>

          <a className={styles.active}>Home</a>
          <a>Post</a>
        </nav>
      </div>
    </header>
  )
}