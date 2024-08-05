import Logo from "@components/Logo/Logo";
import SignInForm from "@components/SignInForm/SignInForm";
import styles from "@styles/signIn.module.css";

const page = async () => {
    return (
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Logo redirectToHome={true} />
        </div>
        <div className={styles.formContainer}>
          <SignInForm/>
        </div>
      </main>
    );
  }

export default page;
  