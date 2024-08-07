import Logo from '@components/Logo/Logo';
import SignUpForm from '@components/SignUpForm/SignUpForm';
import styles from '@styles/signIn.module.css';

const page = async () => {
  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <Logo redirectToHome={true} />
      </div>
      <div className={styles.formContainer}>
        <SignUpForm />
      </div>
    </main>
  );
};

export default page;
