"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.scss';
import logo from '../public/logo.png';
import heroImage from '../public/truck-logistics.jpg';
import googleImage from '../public/google.png';
import LoadingDots from '../components/atoms/LoadingDots';
import { toast } from 'react-toastify';
import Footer from '@/components/layouts/Footer';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard',
      });
  
      if (result?.error) {
        console.error('Sign in error:', result.error);
      } else {
        toast.success('Login in progress, you are bieng redirected ..');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false); 
    }
  };
  

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  
  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (status === 'authenticated' && router.pathname === '/') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <>
      {isLoading && <LoadingDots />}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image 
            src={logo} 
            alt="Logo" 
            width={180} 
            height={50} 
            priority 
          />
        </div>
        <div className={styles.authContainer}>
          {session ? (
            <button 
              className={styles.authButton} 
              onClick={handleSignOut}
            >
              Logout
            </button>
          ) : (
            <button 
              className={styles.authButton} 
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <Image 
                src={googleImage} 
                alt="Google Logo" 
                width={24} 
                height={24} 
              />
              Login with Google
            </button>
          )}
        </div>
      </header>

      {!session && (
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Trucking Logistics Management System
            </h1>
            <p className={styles.heroDescription}>
              Streamline your transportation operations with our comprehensive logistics management solution. Optimize routes, track fleet performance, and enhance efficiency across your entire trucking ecosystem.
            </p>
            <Link href="" className={styles.heroCTA}>
              Get Started
            </Link>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src={heroImage} 
              alt="Trucking Logistics" 
              width={500} 
              height={400} 
              priority 
            />
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Header;