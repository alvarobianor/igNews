import { SignInGitHub } from "../SignInGitHub";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Post</a>
          </ActiveLink>
        </nav>
        <SignInGitHub />
      </div>
    </header>
  );
}
